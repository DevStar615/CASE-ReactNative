import React, { Component } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "./Styles/LoginScreenStyles";
import userAuthAPI from "../API/userAuthAPI";
import { SecureStore } from "expo";
import BottomBar from "./BottomBar";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signinId: null
    };
  }

  onDonePress = async () => {
    if (!this.state.signinId) return Alert.alert("Missing login id");
    this.setState({ loginInProgress: true });
    userAuthAPI(this.state.signinId, this.state.signinId)
      .then(async res => {
        await SecureStore.setItemAsync("username", this.state.signinId);
        await SecureStore.setItemAsync("password", this.state.signinId);
        this.props.navigation.replace("SelectLocationScreen");
      })
      .catch(e => {
        Alert.alert("" + e);
        this.setState({ loginInProgress: false });
      })
      .finally(e => {});
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ImageBackground
          style={{ flex: 1 }}
          source={require("../Assets/HomeScreenBackground.png")}
        >
          <View style={{ flex: 0.6, alignItems: "center" }}>
            <View style={{ flex: 0.5 }} />
            <Image
              source={require("../Assets/CASELogo.png")}
              resizeMode={"contain"}
              style={{ flex: 0.5 }}
            />
          </View>
          <View style={styles.outerBox}>
            {this.state.loginInProgress ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View>
                <Text style={styles.text}>Enter Login ID</Text>
                <View style={styles.box}>
                  <TextInput
                    keyboardType="numeric"
                    onBlur={() => Keyboard.dismiss()}
                    onSubmitEditing={this.onDonePress}
                    onChangeText={text => this.setState({ signinId: text })}
                    returnKeyType={"done"}
                    underlineColorAndroid={"transparent"}
                    style={styles.textInput}
                  />
                </View>
              </View>
            )}
          </View>
          <BottomBar />
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
