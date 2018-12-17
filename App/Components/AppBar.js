import React, { Component } from "react";
import { View, Image, Alert, TouchableOpacity } from "react-native";
import { styles } from "./Styles/AppBarStyles";
import { SecureStore, Constants } from "expo";
import { marketingVersion } from "../../app.json";

export default class AppBar extends Component {
  constructor(props) {
    super(props);
  }

  _handleTap() {
    if (this.props.navigation)
      Alert.alert(
        "Log out?",
        "Are you sure you want to log out of the app?" +
          "\n\n" +
          "CaseSnow v" +
          marketingVersion +
          "\n\nLast Updated: " +
          Constants.manifest.publishedTime,
        [
          {
            text: "Logout",
            onPress: () => {
              SecureStore.deleteItemAsync("username");
              SecureStore.deleteItemAsync("password");
              this.props.navigation.navigate("LoginScreen");
            }
          },

          { text: "Cancel", style: "cancel" }
        ],
        { cancelable: false }
      );
  }
  render() {
    const that = this;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this._handleTap()}>
          <Image
            source={require("../Assets/CASELogo.png")}
            resizeMode={"contain"}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
