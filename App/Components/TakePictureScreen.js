import React, { Component } from "react";
import { View, ImageBackground, Text } from "react-native";
import { ImagePicker, Permissions } from "expo";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import { styles } from "./Styles/TakePictureScreenStyles";
import LocationBox from "./LocationBox";
import { connect } from "react-redux";
import PhotoButtonAndSection from "./PhotoButtonAndSection";
import CommentInputButton from "./CommentInputButton";
import WorkOrderSyncManager from "../helpers/syncManager";
import { setServicesPerformed } from "../actions/index";

class TakePictureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.servicesPerformed || {};
  }

  componentDidMount() {
    this.syncManager = new WorkOrderSyncManager(this);
    this.syncManager.start();
  }

  componentWillUnmount() {
    this.syncManager.stop();
  }

  async setStateAndRedux(obj, doBackup = true) {
    this.setState(obj);
    this.setState({ unsavedWork: true });
    this.state = Object.assign(this.state, obj, { unsavedWork: true });
    this.props.setServicesPerformed(this.state);

    if (doBackup) await this.syncManager.backup(this.state);
  }

  render() {
    let photoUploadStatusLine;
    if (this.state.backupStatus)
      photoUploadStatusLine = (
        <Text
          style={{
            textAlign: "center",
            color: "white",
            backgroundColor: "#3370BC"
          }}
        >
          {this.state.backupStatus}
        </Text>
      );

    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../Assets/HomeScreenBackground.png")}
      >
        <AppBar />
        <View style={{ flex: 1, marginHorizontal: 15 }}>
          <LocationBox
            {...this.props.selectedLocation}
            navigation={this.props.navigation}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flex: 0.2,
              paddingVertical: 20
            }}
          >
            <Text style={styles.headingText}>Comments &amp; Photos</Text>
          </View>

          <CommentInputButton
            value={this.state.comments}
            onChange={v => this.setStateAndRedux({ comments: v })}
          />
          <PhotoButtonAndSection
            value={this.state.photos}
            onChange={v => this.setStateAndRedux({ photos: v })}
          />
        </View>
        {photoUploadStatusLine}
        <BottomBar right={"SubmitScreen"} navigation={this.props.navigation} />
      </ImageBackground>
    );
  }
}

const actions = { setServicesPerformed };

const mapStateToProps = state => ({
  selectedLocation: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition,
  servicesPerformed: state.servicesPerformedReducer.servicesPerformed
});
export default connect(
  mapStateToProps,
  actions
)(TakePictureScreen);
