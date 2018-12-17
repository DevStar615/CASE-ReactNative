import React, { Component } from "react";
import {
  View,
  ImageBackground,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  PixelRatio,
  ScrollView
} from "react-native";
import AppBar from "./AppBar";
import BottomBar from "./BottomBar";
import { styles } from "./Styles/DeIcerScreenStyles";
import LocationBox from "./LocationBox";

export default class DeIcerScreen extends Component {
  constructor(props) {
    super(props);
  }

  renderInput(text1, text2) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ paddingVertical: 5 }}>
          <Text style={styles.shortLabel}>{text2}</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View>
            {PixelRatio.get() > 2 ? (
              <Text style={styles.bigLabel}>{text1}</Text>
            ) : (
              <Text style={[styles.bigLabel, { fontSize: 18 }]}>{text1}</Text>
            )}
          </View>
          <View
            style={{
              backgroundColor: "#ffffff",
              paddingHorizontal: 15,
              paddingVertical: 15,
              width: 140,
              height: 60,
              position: "absolute",
              right: Dimensions.get("window").width / 2 - 60,
              justifyContent: "center"
            }}
          >
            <TextInput
              onSubmitEditing={() =>
                this.props.navigation.navigate("SiteMapScreen")
              }
              underlineColorAndroid={"transparent"}
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>
          <ImageBackground
            style={{
              borderRadius: 45,
              position: "absolute",
              right: Dimensions.get("window").width / 2 - 135,
              borderColor: "#60B6E3",
              borderWidth: 1
            }}
          >
            <Image
              source={require("../Assets/deIcerIcon.png")}
              resizeMode={"contain"}
              style={{ height: 90, width: 90 }}
            />
          </ImageBackground>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../Assets/HomeScreenBackground.png")}
      >
        <View style={{ flex: 0.1 }}>
          <AppBar />
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 0.8 }}>
              <View style={{ flex: 0.15, justifyContent: "center" }}>
                <LocationBox
                  address1={"CVS 123 East Main Street"}
                  address2={"North Attleboro, MA"}
                />
              </View>
              <View style={{ flex: 0.2, justifyContent: "center" }}>
                <Text style={styles.deIcerText}>DE-ICER</Text>
                <Text style={styles.deIcerText}>QUANTITY</Text>
              </View>
              <View
                style={{
                  height: (Dimensions.get("window").height / 10) * 8 * 0.24,
                  justifyContent: "center",
                  marginTop: 5
                }}
              >
                {this.renderInput("LOT", "Tons")}
              </View>
              <View
                style={{
                  height: (Dimensions.get("window").height / 10) * 8 * 0.24,
                  justifyContent: "center"
                }}
              >
                {this.renderInput("WALK", "Bags")}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={{ flex: 0.1 }}>
          <BottomBar
            right={"SiteMapScreen"}
            left={true}
            navigation={this.props.navigation}
          />
        </View>
      </ImageBackground>
    );
  }
}
