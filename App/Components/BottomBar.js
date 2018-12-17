import React, { Component } from "react";
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "./Styles/BottomBarStyles";

export default class BottomBar extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "" };
  }
  confirm = cb => {
    Alert.alert(
      "Are you sure?",
      "You have unsaved work.  Do you want to navigate away from this screen and discard your work?",
      [
        {
          text: "Clear entered data and go back",
          onPress: cb
        },
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  };
  left = async () => {
    let hasUnsavedWork =
      this.props.hasUnsavedWork !== undefined && this.props.hasUnsavedWork();
    if (hasUnsavedWork) {
      this.confirm(() => {
        if (this.props.left && typeof this.props.left == "function")
          this.props.left();
        this.props.navigation.goBack();
      });
    } else {
      if (this.props.left && typeof this.props.left == "function")
        this.props.left();
      this.props.navigation.goBack();
    }
  };
  _handlePressHelp = async () => {
    const uri = "tel:+18889787669";
    if (await Linking.canOpenURL(uri)) {
      Linking.openURL(uri);
    } else {
      Alert.alert("Unable to dial number, please call " + uri);
    }
  };
  _renderSearch() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          // backgroundColor: "#AAACAF",
          justifyContent: "flex-start"
        }}
      >
        <Image
          source={require("../Assets/searchIcon.png")}
          style={{
            height: 30,
            width: 30,
            marginVertical: 5,
            marginHorizontal: 5
          }}
          resizeMode={"contain"}
        />
        <TextInput
          style={{ fontSize: 20, padding: 10, flex: 1 }}
          placeholderTextColor={"#000"}
          placeholder={"Search"}
          onBlur={() => {
            Keyboard.dismiss();
          }}
          onChangeText={text => {
            this.setState({ searchText: text });
          }}
          onSubmitEditing={() => {
            if (this.props.search) this.props.search(this.state.searchText);
          }}
          blurOnSubmit={true}
          returnKeyType={"search"}
          underlineColorAndroid={"transparent"}
          autoCapitalize={"none"}
          autoCorrect={false}
          clearButtonMode={"always"}
          contextMenuHidden={true}
          multiline={false}
        />
      </View>
    );
  }
  _makeButton(name, image, onClick, imageSide) {
    return (
      <TouchableOpacity
        style={{
          flex: 0.5,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          marginHorizontal: 2.5
        }}
        onPress={onClick}
      >
        {imageSide != "right" && (
          <Image
            source={image}
            style={{ maxHeight: "50%" }}
            resizeMode={"contain"}
          />
        )}
        <Text style={{ fontSize: 20, padding: 10, color: "#000" }}>{name}</Text>
        {imageSide == "right" && (
          <Image
            source={image}
            style={{ maxHeight: "50%" }}
            resizeMode={"contain"}
          />
        )}
      </TouchableOpacity>
    );
  }
  _goNext() {
    if (typeof this.props.right == "string")
      this.props.navigation.navigate(this.props.right);
    else if (typeof this.props.right == "function") this.props.right();
    else throw new Error(`bad type in next button: ${typeof this.props.right}`);
  }

  _renderDirectionButtons() {
    if (!this.props.navigation) return;
    let right = null;
    if (this.props.right)
      right = this._makeButton(
        "Next",
        require("../Assets/nextArrow.png"),
        this._goNext.bind(this),
        "right"
      );
    else if (this.props.submit)
      right = this._makeButton(
        "SUBMIT",
        require("../Assets/tickIcon.png"),
        this.props.submit,
        "right"
      );
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {this._makeButton(
          "Back",
          require("../Assets/backArrow.png"),
          this.left.bind(this)
        )}
        {right}
      </View>
    );
  }
  render() {
    return (
      <View style={{ height: 50, flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            flex: 0.3,
            backgroundColor: "#AAACAF",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
          onPress={this._handlePressHelp}
        >
          <Image
            source={require("../Assets/PhoneIcon.png")}
            style={{ maxHeight: "50%" }}
            resizeMode={"contain"}
          />
          <Text style={{ fontSize: 20, padding: 10, color: "#fff" }}>Help</Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 0.7,
            backgroundColor:
              this.props.search || this.props.navigation
                ? "#fff"
                : "transparent",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          {this.props.search
            ? this._renderSearch()
            : this._renderDirectionButtons()}
        </View>
      </View>
    );
  }
}
