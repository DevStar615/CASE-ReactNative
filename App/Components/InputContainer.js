import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";

const style = {
  marginTop: 7,
  backgroundColor: "#fff",
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: 15,
  paddingVertical: 10,
  paddingHorizontal: 10,
  justifyContent: "space-between"
};

export default class InputContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={[style, this.props.style]}
        onPress={this.props.onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
