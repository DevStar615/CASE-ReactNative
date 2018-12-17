import React, { Component } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  PixelRatio,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import AppBar from "./AppBar";
import { styles } from "./Styles/SelectServiceScreenStyles";
import BottomBar from "./BottomBar";
import LocationBox from "./LocationBox";
import { connect } from "react-redux";
import { setServicesPerformed } from "../actions/index";
import PhotoButtonAndSection from "./PhotoButtonAndSection";
import CommentInputButton from "./CommentInputButton";
import WorkOrderSyncManager from "../helpers/syncManager";

class InspectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.props.servicesPerformed || {});
    this.state.selectedServiceDefinition = this.props.selectedServiceDefinition;

    // log the time when we start this activity if we aren't restoring from a crash
    if (!this.state.startedDate) this.state.startedDate = new Date();
  }

  async setStateAndRedux(obj, doBackup = true) {
    this.setState(obj);
    this.setState({ unsavedWork: true });
    let combined = Object.assign({}, this.state, obj, { unsavedWork: true });
    this.props.setServicesPerformed(combined);
    if (doBackup) await this.syncManager.backup(combined);
  }

  async componentDidMount() {
    this.syncManager = new WorkOrderSyncManager(this);
    this.syncManager.start();
  }

  async componentWillUnmount() {
    this.syncManager.stop();
  }

  _confirmSubmit() {
    Alert.alert(
      "Submit",
      "Are you sure you're ready to submit?",
      [
        {
          text: "Yes",
          onPress: async () => {
            const submitDate = new Date();
            this.setStateAndRedux({ submitDate: submitDate });
            // set value manually in addition since we're passing this obj to next screen immediately
            this.state.submitDate = submitDate;

            this.props.setServicesPerformed(this.state);
            this.props.navigation.navigate("InspectionSubmitScreen");
          }
        },
        { text: "Cancel", style: "cancel" }
      ],
      { cancelable: true }
    );
  }

  renderManagerInput() {
    return (
      <View
        style={{
          marginTop: 7,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: "space-between"
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../Assets/noteIcon.png")}
            style={{ height: 20, width: 20 }}
            resizeMode={"contain"}
          />
          <TextInput
            style={{ marginLeft: 20, fontSize: 20, flex: 1 }}
            underlineColorAndroid={"transparent"}
            returnKeyType="done"
            placeholder="Customer Rep."
            blurOnSubmit={true}
            onChangeText={text =>
              this.setState({
                managerInput: text
              })
            }
            onBlur={() => this.setStateAndRedux({})}
            value={this.state.managerInput}
          />
        </View>
      </View>
    );
  }

  renderShowMapButton() {
    let width = 0;
    return (
      <TouchableOpacity
        style={{
          marginTop: 7,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
          paddingVertical: 10,
          paddingHorizontal: 10,
          justifyContent: "space-between"
        }}
        onPress={() =>
          // this.props.navigation.navigate("ServiceVerificationScreen")
          this.props.navigation.navigate("StartServiceScreen", {
            disableNext: true
          })
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../Assets/siteMapIcon.png")}
            style={{ height: 20, width: 20 }}
            resizeMode={"contain"}
          />
          <Text
            style={{
              fontSize: 20,
              letterSpacing: 0,
              color: "#231F20",
              //fontFamily: "Univers LT Std";
              marginLeft: 20
            }}
          >
            View Site Map
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    // when clicking back button this value is nulled out
    // so exit render early to avoid crash
    if (!this.props.selectedServiceDefinition) return <View />;

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
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.3 }}>
            <LocationBox
              {...this.props.selectedLocation}
              // navigation={this.props.navigation}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: PixelRatio.get() > 2 ? 0 : 5,
                // flex: 0.2
                marginBottom: 20
              }}
            >
              <Image
                source={{ uri: this.props.selectedServiceDefinition.imageUrl }}
                resizeMode={"contain"}
                style={{
                  height: 35,
                  width: 35,
                  marginHorizontal: 5,
                  marginVertical: 5
                }}
              />
              <Text style={styles.snowText}>
                {this.props.selectedServiceDefinition.name.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            {this.renderManagerInput()}
            {this.renderShowMapButton()}
            <CommentInputButton
              value={this.state.comments}
              onChange={v => this.setStateAndRedux({ comments: v })}
            />
            <PhotoButtonAndSection
              value={this.state.photos}
              onChange={v => this.setStateAndRedux({ photos: v })}
            />
            {photoUploadStatusLine}
          </View>
        </View>

        <BottomBar
          left={async () => {
            await this.setStateAndRedux({
              cancelled: true,
              cancelledDate: new Date()
            });
            this.props.setServicesPerformed(null);
          }}
          navigation={this.props.navigation}
          submit={this.state.unsavedWork ? () => this._confirmSubmit() : false}
          hasUnsavedWork={() => this.state.unsavedWork}
        />
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = { setServicesPerformed };

const mapStateToProps = state => ({
  selectedLocation: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition,
  servicesPerformed: state.servicesPerformedReducer.servicesPerformed
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionScreen);
