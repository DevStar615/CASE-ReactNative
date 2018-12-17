import React, { Component } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  PixelRatio,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import {
  selectServiceDefinition,
  setServicesPerformed
} from "../actions/index";
import AppBar from "./AppBar";
import { styles } from "./Styles/ServiceTypeScreenStyles";
import BottomBar from "./BottomBar";
import LocationBox from "./LocationBox";
import { getLocationImageUrl } from "../API/locationImageAPI";
import { selectLocation } from "../actions/index";

class ServiceTypeScreen extends Component {
  constructor(props) {
    super(props);
    if (
      this.props.selectedServiceDefinition &&
      this.props.selectedServiceDefinition.screen
    ) {
      this.props.navigation.navigate("StartServiceScreen", {
        nextScreen: this.props.selectedServiceDefinition.screen
      });
    }
  }

  renderServiceBox(item) {
    let { screen } = item;
    const name = item.service_definition;
    let imageUrl = null;
    if (item.definition_file_ids) {
      item.definition_file_ids.map(i => {
        imageUrl = getLocationImageUrl(i, i);
      });
    }
    return (
      <TouchableOpacity
        key={name + "|" + imageUrl}
        style={styles.serviceBox}
        onPress={() => {
          if (!screen) screen = "SelectServiceScreen";
          if (screen == "StartInspectionScreen") screen = "InspectionScreen";

          this.props.selectServiceDefinition({
            name: name,
            imageUrl: imageUrl,
            screen: screen
          });

          this.props.navigation.navigate("StartServiceScreen", {
            nextScreen: screen
          });
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl, cache: "force-cache" }}
            resizeMode={"contain"}
            style={{
              flex: 1,
              margin: 10,
              minWidth: 100,
              minHeight: 100,
              width: "100%",
              resizeMode: "cover"
            }}
            onError={e => Alert.alert("Error loading image")}
          />
        ) : (
          ""
        )}
        {PixelRatio.get() > 2 ? (
          <Text style={styles.name}>{name}</Text>
        ) : (
          <Text style={[styles.name, { fontSize: 18 }]}>{name}</Text>
        )}
      </TouchableOpacity>
    );
  }

  _makeListEven(inputList) {
    inputList = inputList || [];
    inputList = inputList.filter(e => e.blank !== true);
    while (inputList.length % 2 !== 0) inputList.push({ empty: true });
    return inputList;
  }

  clear() {
    this.props.selectLocation(null);
    this.props.setServicesPerformed(null);
  }

  render() {
    let servicesSeen = [];
    let serviceTypes =
      this.props.location &&
      this.props.location.services &&
      this.props.location.services.filter(function(a) {
        var key = a.service_definition + "|" + a.service_definition_icon_light;
        if (servicesSeen.indexOf(key) == -1) {
          servicesSeen.push(key);
          return true;
        }
      });

    serviceTypes = this._makeListEven(serviceTypes);

    return (
      <ImageBackground
        style={styles.imageBackground}
        source={require("../Assets/HomeScreenBackground.png")}
      >
        <AppBar />
        <View style={{ flex: 1 }}>
          <LocationBox
            {...this.props.location}
            navigation={this.props.navigation}
          />
          <Text style={styles.headingText}>Service Type</Text>

          <FlatList
            ref="serviceList"
            numColumns={2}
            style={{
              flex: 1,
              marginHorizontal: 15,
              paddingVertical: 10,
              paddingHorizontal: 10,
              // backgroundColor: "#eee",
              marginBottom: 10
            }}
            data={serviceTypes}
            showsVerticalScrollIndicator={true}
            renderItem={({ item }) => {
              if (item.empty === true)
                return (
                  <View
                    style={[
                      styles.serviceBox,
                      { backgroundColor: "transparent" }
                    ]}
                  />
                );
              return this.renderServiceBox(item);
            }}
            keyExtractor={t => t.service_definition}
          />
        </View>
        <BottomBar
          left={() => this.clear()}
          right={false}
          navigation={this.props.navigation}
        />
      </ImageBackground>
    );
  }
}
const mapStateToProps = state => ({
  location: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition
});
const actions = {
  selectServiceDefinition,
  selectLocation,
  setServicesPerformed
};
export default connect(
  mapStateToProps,
  actions
)(ServiceTypeScreen);
