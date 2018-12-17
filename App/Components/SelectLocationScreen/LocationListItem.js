import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../Styles/SelectLocationScreenStyles";

const _round = (value, precision) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const LocationListItem = props => (
  <TouchableOpacity style={styles.box} onPress={props.onPress}>
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={[styles.text1, { fontWeight: "bold" }]}>
        {props.item.name
          .replace(
            ", " + props.item.shippingcity + ", " + props.item.shippingstate,
            ""
          )
          .replace(
            ", " + props.item.shippingcity + " " + props.item.shippingstate,
            ""
          )}
      </Text>
      <Text style={styles.text1}>
        {props.item.shippingcity}, {props.item.shippingstate}
      </Text>
    </View>
    <View style={{ justifyContent: "center" }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text style={styles.milesText}>
          {props.item.distance
            ? _round(props.item.distance, props.item.distance >= 2 ? 0 : 1) +
              " miles"
            : ""}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default LocationListItem;
