import getCurrentLocation from "./currentLocation";
import {
  startWorkLog,
  updateWorkLog,
  submitWorkLog,
  uploadImageAsync
} from "../API/workResultAPI";

export default class WorkOrderSyncManager {
  constructor(componentToSync) {
    this.componentToSync = componentToSync;
    this.state = componentToSync.state;
    this._started = false;
    this._backupActive = false;
    this._backupQueue = 0;
    this.photosLeftToUpload = 0;

    this.backupStep = 0;
    this.backupSteps = [
      "Checking Location",
      "Uploading notes",
      "Uploading Photos",
      "Uploading Details",
      "Validating Information"
    ];
  }

  async start() {
    this._started = true;
    this.setState({
      backupStatus: "",
      backupStep: this.backupStep,
      backupSteps: this.backupSteps
    });
    // if (!this.state.workId) await this.persist();
    // else await this.backup();
  }

  async stop() {
    this._stopped = false;
  }

  // FIXME these helpers are smelly

  setState(newVal) {
    return this.componentToSync.setState(newVal);
  }

  setStateAndRedux(newVal) {
    return this.componentToSync.setStateAndRedux(newVal, false);
  }

  _calculatePhotosLeftToUpload() {
    let photoUrisUploaded = this.state.photoUrisUploaded || [];
    let photosLeftToUpload = 0;
    for (let p of this.state.photos || []) {
      if (photoUrisUploaded.includes(p.uri)) continue;
      photosLeftToUpload++;
    }
    this.setState({ photosLeftToUpload: photosLeftToUpload });
    this.photosLeftToUpload = photosLeftToUpload;
    return photosLeftToUpload;
  }

  _setPhotoProgress() {
    let left = this._calculatePhotosLeftToUpload();
    let total = this.state.photos.length;
    let num = total - left + 1;
    if (num > total) num = total;
    let statusString = `Uploading photo ${num} of ${total}`;
    this.backupSteps[2] = statusString;
    this.setState({
      backupSteps: this.backupSteps,
      backupStatus: `Syncing: ${statusString}`
    });
    return statusString;
  }

  async persist() {
    if (this._stopped) return; // cancel if unmounted
    let loc = await getCurrentLocation();
    if (this._stopped) return; // cancel if unmounted
    let newRecord = await startWorkLog(
      loc,
      this.componentToSync.props.selectedLocation.sfid,
      this.componentToSync.state
    );
    if (this._stopped) return; // cancel if unmounted
    this.componentToSync.setStateAndRedux({ workId: newRecord.id }, false);
    this.state.workId = newRecord.id;
  }

  async backup(state) {
    this.state = state || this.componentToSync.state;
    console.log("backing up", this.state.workId);

    if (!this._started) {
      console.log("skipping backup since not started yet");
      return;
    }
    if (this._backupActive) {
      console.log("skipping backup since another backup is active");
      this._backupQueue++;
      return;
    }
    this._backupActive = true;
    this._backupQueue = 0; // assume that everything queued will be sent

    try {
      this.setState({
        backupStatus: "Syncing: Getting location",
        backupStep: 0
      });
      let loc;
      if (this.state.loc && this.state.loc.timestamp) {
        var msSince = new Date().getTime() - this.state.loc.timestamp;
        // regfresh timestamp if it's a few mins old
        if (msSince / 1000 < 5 * 60) loc = this.state.loc;
      }
      if (!loc) loc = await getCurrentLocation();
      this.setStateAndRedux({ loc: loc }, false);

      this.setState({
        backupStatus: "Syncing: Saving notes to server",
        backupStep: 1
      });

      if (!this.state.workId) {
        console.log(
          "tried to backup before the work id exists, generating now"
        );
        await this.persist();
      }

      await updateWorkLog(this.state.workId, loc, this.state);

      this.setState({
        backupStatus: "Syncing: Uploading photos",
        backupStep: 2
      });
      await this.photosBackup();

      this._backupQueue--;

      this.setState({
        backupStatus: ""
      });
    } catch (e) {
      console.log(e);
      console.log(JSON.stringify(e));

      if (`${e}`.includes(`{"error":"already submitted"}`)) {
        await this.setStateAndRedux(
          {
            cancelled: true,
            cancelledDate: new Date()
          },
          false
        );
        this.componentToSync.props.setServicesPerformed(null);
        this.componentToSync.props.navigation.goBack();
        return;
      }

      // an error happened when syncing data
      // retry in a little bit?
      this.setState({
        backupStatus: "Sync pending... (retrying)"
      });
      // retry in X seconds and hopefully they are online
      setTimeout(() => {
        this.backup();
      }, 10000);
    }

    this._backupActive = false;

    // run a backup again if more data arrived since last backup started
    if (this._backupQueue > 0) this.backup();
  }

  async submit(state) {
    this.state = state;
    await this.backup(state);
    this.setState({ backupStep: 3 });
    await submitWorkLog(this.state.workId, this.state.loc, this.state);
    this.setState({ backupStep: 5 });
  }

  async photosBackup() {
    if (!this.state.photos) return;
    let photoUrisUploaded = this.state.photoUrisUploaded || [];

    // do the uploads

    for (let p of this.state.photos || []) {
      this._setPhotoProgress();

      if (photoUrisUploaded.includes(p.uri)) continue;
      let uploadStartTime = new Date();
      await uploadImageAsync(this.state.workId, p.uri);
      let uploadEndTime = new Date();
      this.setState({ lastUploadTime: uploadEndTime - uploadStartTime });
      photoUrisUploaded.push(p.uri);

      this._calculatePhotosLeftToUpload();
    }
    this._calculatePhotosLeftToUpload();
    this.setStateAndRedux({ photoUrisUploaded: photoUrisUploaded }, false);
  }
}
