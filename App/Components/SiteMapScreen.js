import React, { Component } from "react";
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  PixelRatio
} from "react-native";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import { styles } from "./Styles/SiteMapScreenStyles";
import { connect } from "react-redux";
import LocationBox from "./LocationBox";

class SiteMapScreen extends Component {
  render() {
    if (!this.props.location) return <View />;
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../Assets/HomeScreenBackground.png")}
      >
        <View style={{ flex: 0.1 }}>
          <AppBar />
        </View>
        <View style={{ flex: 0.8 }}>
          <View style={{ flex: 0.15 }}>
            <LocationBox {...this.props.location} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flex: 0.2,
              paddingVertical: 20,
              marginHorizontal: 15
            }}
          >
            <Image
              source={require("../Assets/whiteInfoIcon.png")}
              resizeMode={"contain"}
              style={{
                height: 60,
                width: 60,
                marginHorizontal: 10,
                marginVertical: 5
              }}
            />
            <Text style={styles.infoText}>INFO</Text>
          </View>
          <View
            style={[
              styles.container,
              {
                flex: 0.4,
                justifyContent: "center",
                marginHorizontal: 15
              }
            ]}
          >
            <View style={{ paddingHorizontal: 25, paddingTop: 10 }}>
              <Text style={styles.boldText}>{this.props.location.name}</Text>
              <Text style={styles.text1}>
                {this.props.location.billingstreet ||
                  this.props.location.shippingstreet}
              </Text>
              <Text style={styles.text1}>
                {this.props.location.billingcity ||
                  this.props.location.shippingcity}
                ,{" "}
                {this.props.location.billingstate ||
                  this.props.location.shippingstate}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.container,
              {
                flex: 0.15,
                marginTop: 15,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginHorizontal: 15
              }
            ]}
            onPress={() =>
              this.props.navigation.navigate("ServiceVerificationScreen")
            }
          >
            <Image
              source={require("../Assets/siteMapIcon.png")}
              resizeMode={"contain"}
              style={{
                height: 50,
                width: 50,
                marginHorizontal: 10,
                marginVertical: 5
              }}
            />
            <Text style={styles.boldText2}>Site Map</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.1 }}>
          <BottomBar
            left={this.props}
            right={"TakePictureScreen"}
            navigation={this.props.navigation}
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  location: state.getLocationReducer.selectedLocation
});
const actions = {};
export default connect(
  mapStateToProps,
  actions
)(SiteMapScreen);
