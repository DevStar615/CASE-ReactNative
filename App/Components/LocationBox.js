import React, { Component } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { styles } from "./Styles/ServiceTypeScreenStyles";

export default class LocationBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const address1 =
      this.props.address1 ||
      this.props.billingstreet ||
      this.props.shippingstreet;
    const address2 =
      this.props.address2 ||
      (this.props.billingcity || this.props.shippingcity) +
        ", " +
        (this.props.billingstate || this.props.shippingstate);
    return (
      <TouchableOpacity
        style={styles.box}
        onPress={e => {
          if (this.props.navigation)
            this.props.navigation.navigate("SiteMapScreen");
        }}
      >
        <View
          style={{
            flex: 0.15,
            justifyContent: "center",
            paddingHorizontal: 10
          }}
        >
          <Image
            source={require("../Assets/locationIcon.png")}
            resizeMode={"contain"}
            style={{ height: 30, width: 30 }}
          />
        </View>
        <View style={{ flex: 0.85, justifyContent: "center" }}>
          <Text style={styles.text1}>{address1}</Text>
          <Text style={styles.text1}>{address2}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
