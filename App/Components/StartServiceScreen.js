import React, { Component } from "react";
import { View, ImageBackground, Text } from "react-native";
import { connect } from "react-redux";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import LocationBox from "./LocationBox";
import Gallery from "react-native-image-gallery";
import { getLocationImageUrl } from "../API/locationImageAPI";
import { selectServiceDefinition } from "../actions/index";

class StartServiceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      nextScreen: this.props.navigation.getParam("nextScreen")
    };

    if (this.props.servicesPerformed) {
      this.props.navigation.navigate(
        this.props.selectedServiceDefinition.screen
      );
    }
  }

  componentWillMount() {
    var files = (this.props.location.services || [])
      .filter(
        e =>
          e.service_definition == this.props.selectedServiceDefinition.name &&
          e.files
      )
      .map(e => e.files)
      .reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue);
      }, []);
    var images = files.map(id => {
      return {
        source: { uri: getLocationImageUrl(this.props.location.sfid, id) }
      };
    });
    this.setState({
      file_ids: files,
      images: images
    });
  }

  render() {
    // protection in case things were unset
    if (!this.props.location) return <View />;

    let specialRequirements;
    if (this.props.location.location_service_notes__c) {
      var textStyle = {
        textAlign: "center",
        color: "white"
      };
      specialRequirements = (
        <View style={{ borderWidth: 1, borderColor: "white", margin: 8 }}>
          <Text style={[textStyle, { fontWeight: "bold" }]}>
            Special Requirements
          </Text>
          <Text style={[textStyle]}>
            {this.props.location.location_service_notes__c}
          </Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <AppBar />
        <View style={{ flex: 1 }}>
          <ImageBackground
            style={{ flex: 1 }}
            source={require("../Assets/HomeScreenBackground.png")}
          >
            <LocationBox
              {...this.props.location}
              // navigation={this.props.navigation}
            />
            {specialRequirements}
            <View
              style={{
                flex: 1,
                flexDirection: "column"
              }}
            >
              {this.state.images && this.state.images.length > 0 ? (
                <Gallery
                  style={{ flex: 1 }}
                  images={this.state.images}
                  pageMargin={10}
                />
              ) : (
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    paddingTop: 20,
                    color: "white",
                    fontWeight: "bold"
                  }}
                >
                  No site maps available
                </Text>
              )}
            </View>
            <BottomBar
              left={() => {
                this.props.selectServiceDefinition(null);
              }}
              right={this.state.nextScreen}
              navigation={this.props.navigation}
            />
          </ImageBackground>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({
  location: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition,
  servicesPerformed: state.servicesPerformedReducer.servicesPerformed
});
const actions = { selectServiceDefinition };
export default connect(
  mapStateToProps,
  actions
)(StartServiceScreen);
