import React, { Component } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import { styles } from "./Styles/ServiceVerificationScreenStyles";
import LocationBox from "./LocationBox";
import { MapView } from "expo";
import { connect } from "react-redux";
import Lightbox from "react-native-lightbox";
import { getLocationImageUrl } from "../API/locationImageAPI";

class ServiceVerificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
  }

  componentWillMount() {
    var files = (this.props.location.services || [])
      .filter(
        e =>
          e.service_definition ==
            (this.props.selectedServiceDefinition || {}).name && e.files
      )
      .map(e => e.files)
      .reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue);
      }, []);
    this.setState({ files: files });
    if (files && files.length > 0)
      this.setState({
        locationImageUrl: getLocationImageUrl(
          this.props.location.sfid,
          files[0]
        )
      });
  }

  render() {
    return (
      <ImageBackground
        source={require("../Assets/HomeScreenBackground.png")}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 0.1 }}>
          <AppBar />
        </View>
        <View style={{ flex: 0.8 }}>
          <LocationBox {...this.props.selectedLocation} />

          <View style={{ padding: 2, margin: 8, backgroundColor: "#fff" }}>
            <Lightbox navigator={this.props.navigator} style={{}}>
              <Image
                style={{ height: 300, maxHeight: 300 }}
                source={{
                  uri: this.state.locationImageUrl
                }}
              />
            </Lightbox>
          </View>
        </View>
        <View style={{ flex: 0.1 }}>
          <BottomBar
            left={true}
            right={false}
            navigation={this.props.navigation}
          />
        </View>
      </ImageBackground>
    );
  }
}

const actions = {};
const mapStateToProps = state => ({
  selectedLocation: state.getLocationReducer.selectedLocation,
  location: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition
});
export default connect(
  mapStateToProps,
  actions
)(ServiceVerificationScreen);
