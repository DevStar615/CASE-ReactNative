import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Text,
  Image,
  PixelRatio,
  FlatList,
  LayoutAnimation
} from "react-native";
import AppBar from "./AppBar";
import { styles } from "./Styles/SelectServiceScreenStyles";
import BottomBar from "./BottomBar";
import LocationBox from "./LocationBox";
import { connect } from "react-redux";
import { setServicesPerformed } from "../actions/index";
import InputContainer from "./InputContainer";
import WorkOrderSyncManager from "../helpers/syncManager";

class SelectServiceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.props.servicesPerformed || {});
    this.state.selectedServiceDefinition = this.props.selectedServiceDefinition;
    this.state.services = this.props.selectedLocation.services;
    this.state.selectedServiceDefinition = this.props.selectedServiceDefinition;
    if (!this.state.selectedServices) this.state.selectedServices = {};

    // log the time when we start this activity if we aren't restoring from a crash
    if (!this.state.startedDate) this.state.startedDate = new Date();
  }

  async setStateAndRedux(obj, doBackup = true) {
    this.setState(obj);
    this.setState({ unsavedWork: true });
    this.state = Object.assign(this.state, obj, { unsavedWork: true });
    this.props.setServicesPerformed(this.state);
  }

  componentDidMount() {
    // copy the services to state so we can interact with it
    this.syncManager = new WorkOrderSyncManager(this);
    this.syncManager.start();
  }

  componentWillUnmount() {
    console.log("componentWillUnmount ...");
    this.syncManager.stop();
  }

  componentWillUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  }

  renderService = item => {
    const text = item.service;
    const expanded = this.state.expandedService == item.id;
    const selected = this.state.selectedServices[item.id];
    const optionSelected = this.state.selectedServices[item.id];

    // filter to selected service definition
    if (item.service_definition != this.props.selectedServiceDefinition.name)
      return;

    return (
      <View>
        <InputContainer
          onPress={() => {
            if (this.state.expandedService == item.id) {
              this.setStateAndRedux({ expandedService: null }, false);
            } else {
              if (item.options.length == 1) {
                let x = Object.assign({}, this.state.selectedServices);
                item.options.map((res, key) => {
                  x[item.id] = x[item.id] == res ? undefined : res;
                });
                this.setStateAndRedux({ selectedServices: x });
              } else {
                this.setStateAndRedux({ expandedService: item.id }, false);
              }
            }
          }}
        >
          <Text style={styles.boxText}>{text}</Text>
          <Text style={[styles.boxText, { fontWeight: "normal" }]}>
            {optionSelected && " " + optionSelected + ""}
          </Text>
        </InputContainer>
        {expanded ? (
          <View>
            {item.options.map((res, key) => (
              <InputContainer
                key={key}
                // style={styles.subBox}
                onPress={() => {
                  let x = Object.assign({}, this.state.selectedServices);
                  const deselecting = x[item.id] == res;
                  if (deselecting) {
                    delete x[item.id];
                  } else {
                    x[item.id] = res;
                  }
                  this.setStateAndRedux({
                    selectedServices: x,
                    expandedService: null
                  });
                }}
              >
                <Text style={styles.subBoxText}>{res}</Text>
                <Text style={styles.subBoxText}>
                  {this.state.selectedServices[item.id] == res ? "✔" : ""}
                </Text>
              </InputContainer>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    // safety when we're unsetting things
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
          <LocationBox
            {...this.props.selectedLocation}
            navigation={this.props.navigation}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: PixelRatio.get() > 2 ? 0 : 5,
              flex: 0.2
            }}
          >
            {this.props.selectedServiceDefinition.imageUrl ? (
              <Image
                source={{
                  uri: this.props.selectedServiceDefinition.imageUrl,
                  cache: "force-cache"
                }}
                resizeMode={"contain"}
                style={{
                  height: 60,
                  width: 60,
                  marginHorizontal: 5,
                  marginVertical: 5
                }}
              />
            ) : (
              ""
            )}
            <Text style={styles.snowText}>
              {this.props.selectedServiceDefinition.name}
            </Text>
          </View>
          <View style={{ flex: 0.1, justifyContent: "center" }}>
            <Text style={styles.serviceText}>
              Select All the services completed
            </Text>
          </View>
          <FlatList
            style={{
              flex: 0.5
            }}
            data={this.state.services}
            showsVerticalScrollIndicator={true}
            keyExtractor={item => item.id}
            renderItem={({ item }) => this.renderService(item)}
          />
        </View>
        {photoUploadStatusLine}
        <BottomBar
          left={async () => {
            await this.setStateAndRedux({
              cancelled: true,
              cancelledDate: new Date()
            });
            this.props.setServicesPerformed(null);
          }}
          right={async () => {
            try {
              await this.syncManager.backup(this.state);
            } catch (e) {
              // allow user to be offline for now
            }
            this.props.navigation.navigate("TakePictureScreen");
          }}
          navigation={this.props.navigation}
          hasUnsavedWork={() => this.state.unsavedWork}
        />
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
)(SelectServiceScreen);
