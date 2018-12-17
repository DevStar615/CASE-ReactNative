import React, { Component } from "react";
import {
  Alert,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  View
} from "react-native";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import { connect } from "react-redux";
import {
  setServicesPerformed,
  selectLocation,
  selectServiceDefinition
} from "../actions/index";
import { submitWorkLog, uploadImageAsync } from "../API/workResultAPI";
import getCurrentLocation from "../helpers/currentLocation";
import WorkOrderSyncManager from "../helpers/syncManager";

class InspectionSubmitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.props.servicesPerformed || {});
    // default the status until the syncmanager takes over
    this.state = Object.assign(this.state, { backupStep: -1, backupSteps: [] });
  }

  async componentDidMount() {
    this._processUpload();
  }

  setStateAndRedux(obj) {
    this.setState(obj);
    let combined = Object.assign({}, this.state, obj);
    this.props.setServicesPerformed(combined);
  }

  async _processUpload() {
    try {
      this.syncManager = new WorkOrderSyncManager(this);
      await this.syncManager.start(this.state);
      await this.syncManager.submit(this.state);
    } catch (e) {
      if (`${e}`.includes(`{"error":"already submitted"}`)) {
        this.setState({ stepNumber: 4 });
      } else {
        Alert.alert("Error Submitting Data", `${e}`);
        this.props.navigation.goBack();
      }
    }
  }

  _statusRow(stepName) {
    var statusColumn;
    if (this.state.backupStep > this.state.backupSteps.indexOf(stepName))
      statusColumn = <Text>✓</Text>;
    else if (this.state.backupStep === this.state.backupSteps.indexOf(stepName))
      statusColumn = <ActivityIndicator color="white" />;
    else statusColumn = <View />;
    return (
      <View
        key={stepName}
        style={{ flexDirection: "row", width: "70%", marginBottom: 10 }}
      >
        {statusColumn}
        <Text
          style={{
            color: "white",
            textAlignVertical: "center",
            marginLeft: 10,
            fontSize: 18
          }}
        >
          {stepName}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../Assets/HomeScreenBackground.png")}
      >
        <AppBar />
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              fontSize: 32,
              letterSpacing: 0,
              color: "#fff",
              textAlign: "center",
              marginTop: 10,
              paddingVertical: 15
            }}
          >
            Submitting...
          </Text>

          {this.state.backupSteps
            ? this.state.backupSteps.map(e => this._statusRow(e))
            : ""}
          {this.state.backupStep == this.state.backupSteps.length ? (
            <TouchableOpacity
              onPress={() => {
                this.props.setServicesPerformed(null);
                this.props.selectLocation(null);
                this.props.selectServiceDefinition(null);
                this.props.navigation.navigate("SelectLocationScreen");
              }}
            >
              <Text
                style={{
                  marginTop: 20,
                  fontSize: 30,
                  color: "#ffffff",
                  textAlign: "center"
                }}
              >
                Great job!
              </Text>
              <Text
                style={{ fontSize: 20, color: "#ffffff", textAlign: "center" }}
              >
                Tap here to return back to the list of locations!
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{ color: "white", marginBottom: 10, fontWeight: "bold" }}
            >
              Please stay on this screen until the data is submitted
            </Text>
          )}
        </View>
        {/* user can't go back, just here for help button */}
        <BottomBar />
      </ImageBackground>
    );
  }
}

const actions = {
  setServicesPerformed,
  selectLocation,
  selectServiceDefinition
};

const mapStateToProps = state => ({
  selectedLocation: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition,
  servicesPerformed: state.servicesPerformedReducer.servicesPerformed
});
export default connect(
  mapStateToProps,
  actions
)(InspectionSubmitScreen);
