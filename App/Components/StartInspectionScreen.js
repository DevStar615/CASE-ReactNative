import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import LocationBox from "./LocationBox";
import Gallery from "react-native-image-gallery";
import { getLocationImageUrl } from "../API/locationImageAPI";

const styles = StyleSheet.create({});

class StartInspectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
    this._imageCarousel = null;
  }

  componentWillMount() {
    var files = this.props.location.services
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

    // skip map view if there is no map?
    setTimeout(() => {
      if (!this.state.images)
        this.props.navigation.navigate("InspectionScreen");
    }, 1000);
  }

  render() {
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
              navigation={this.props.navigation}
            />
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
              right="InspectionScreen"
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
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition
});
const actions = {};
export default connect(
  mapStateToProps,
  actions
)(StartInspectionScreen);
