import React, { Component } from "react";
import {
  Alert,
  FlatList,
  View,
  ImageBackground,
  Modal,
  Text,
  TouchableOpacity
} from "react-native";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import LocationBox from "./LocationBox";
import { styles } from "./Styles/SubmitScreenStyles";
import { connect } from "react-redux";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import WorkOrderSyncManager from "../helpers/syncManager";
import ServiceDateChangeScreen from "./ServiceDateChangeScreen";
import {
  setServicesPerformed,
  selectLocation,
  selectServiceDefinition
} from "../actions/index";

class SubmitScreen extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.servicesPerformed || {};
    this.state.showServiceDateChangeScreen = false;
  }
  componentDidMount() {
    this.syncManager = new WorkOrderSyncManager(this);
    this.syncManager.start();
  }
  async setStateAndRedux(obj) {
    this.setState(obj);
    this.setState({ unsavedWork: true });
    this.state = Object.assign(this.state, obj, { unsavedWork: true });
    this.props.setServicesPerformed(this.state);
  }
  renderItem(item) {
    if (typeof item == "string") return <Text key={item}>{item}</Text>;

    // let selectedService = this.props.servicesPerformed.selectedServices[
    //   item.id
    // ];

    var x =
      item.services &&
      item.services.map(e => {
        var selected = this.props.servicesPerformed.selectedServices[e.id];
        if (selected)
          return (
            <Text key={e.id} style={{ fontSize: 16, marginLeft: 16 }}>
              {e.service}: {selected}
            </Text>
          );
      });

    return (
      <View style={{}}>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>
          <Text style={{ fontWeight: "bold" }} key={item.name}>
            {item.name}
          </Text>
        </Text>
        {x}
      </View>
    );
  }
  render() {
    //safety for when we're unsetting everything
    if (!this.props.servicesPerformed) return <View />;
    this.state.confirmationList = [];
    var m = moment(this.state.customDate || this.state.startedDate);
    for (var x of [
      this.props.userInfo.name,
      "Work Order Tracking Code: " +
        (this.state.workId || "WAITING FOR NETWORK").split("-")[0],
      "Service Date: " + m.format("ddd, MMM Do YYYY"),
      "Service Time: " + m.format("h:mm:ss a"),
      "Photos: " + (this.state.photos || []).length
    ]) {
      this.state.confirmationList.push({ name: x });
    }
    this.state.confirmationList.push({
      name: "Services Logged",
      services: this.props.servicesPerformed.services
    });
    if (this.state.comments && this.state.comments[0].comment) {
      this.state.confirmationList.push({
        name: "Comments"
      });
      this.state.confirmationList.push(this.state.comments[0].comment);
    }

    // console.log(this.props);
    return (
      <ImageBackground
        source={require("../Assets/HomeScreenBackground.png")}
        style={{ flex: 1 }}
      >
        <AppBar />
        <View style={{ flex: 1, marginHorizontal: 15 }}>
          <LocationBox {...this.props.selectedLocation} />
          <Text style={styles.headingText}>Service Summary</Text>
          <FlatList
            bounces={false}
            contentContainerStyle={{
              // flex: 1,
              backgroundColor: "#A0C8E2",
              marginTop: 8,
              marginBottom: 10,
              padding: 8
            }}
            data={this.state.confirmationList}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={item => item.name}
          />

          <View
            style={{
              marginBottom: 8,
              marginTop: 8
            }}
          >
            <TouchableOpacity
              style={{ backgroundColor: "#FFFFFF", padding: 5 }}
              onPress={() => {
                // this.props.navigation.navigate("ServiceDateChangeScreen");
                this.setState({ showServiceDateChangeScreen: true });
              }}
            >
              <Text style={{ fontSize: 18, textAlign: "center" }}>
                Change Service Date &amp; Time
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text style={styles.strongText}>
              By submitting this work order you acknowledge that all information
              is accurate and you have performed all necessary services.
            </Text>
          </View>
        </View>
        <BottomBar
          submit={async () => {
            this.setState({ spinner: true });
            try {
              await this.syncManager.submit();
            } catch (e) {
              return Alert.alert(
                "Error",
                "An error occurred when submitting the work order:\n" +
                  e.message +
                  "\n\nPlease try again or contact CaseSnow."
              );
            }
            Alert.alert(
              "Service Submitted",
              "Your service was successfully submitted.\n\nReference Number: " +
                this.state.workId.split("-")[0],
              [
                {
                  text: "OK",
                  onPress: () => {
                    this.props.setServicesPerformed(null);
                    this.props.selectLocation(null);
                    this.props.selectServiceDefinition(null);
                    this.props.navigation.navigate("SelectLocationScreen");
                  }
                }
              ]
            );
          }}
          navigation={this.props.navigation}
        />
        <Modal
          visible={this.state.showServiceDateChangeScreen}
          onRequestClose={() =>
            this.setState({ showServiceDateChangeScreen: false })
          }
          // onShow={() => {
          //   this.__commentInput.focus();
          // }}
        >
          <ServiceDateChangeScreen
            navigation={this.props.navigation}
            onSave={customDate =>
              this.setState({
                customDate: customDate,
                showServiceDateChangeScreen: false
              })
            }
            onCancel={() =>
              this.setState({ showServiceDateChangeScreen: false })
            }
          />
        </Modal>
        <Spinner
          visible={this.state.spinner}
          textContent={this.state.backupStatus}
          textStyle={{ color: "#FFF" }}
        />
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
  servicesPerformed: state.servicesPerformedReducer.servicesPerformed,
  userInfo: state.userInfoReducer.userInfo
});
export default connect(
  mapStateToProps,
  actions
)(SubmitScreen);
