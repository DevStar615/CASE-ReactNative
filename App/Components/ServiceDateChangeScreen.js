import React, { Component } from "react";
import {
  ImageBackground,
  PixelRatio,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppBar from "./AppBar";
import { connect } from "react-redux";
import DatePicker from "react-native-datepicker";

class ServiceDateChangeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { customDate: this.props.customDate || new Date() };
  }

  _dateUpdated(newDate) {
    let x = {
      customDate: newDate
    };
    this.setState(x);
    // two datepickers on same screen don't seem to update consistenly without this
    this.forceUpdate();
  }

  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../Assets/HomeScreenBackground.png")}
      >
        <AppBar />
        <View style={{ flex: 1 }}>
          <View style={{}}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: PixelRatio.get() > 2 ? 0 : 5,
                // flex: 0.2
                marginBottom: 20
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  color: "#FFFFFF",
                  fontWeight: "800",
                  textAlign: "center"
                }}
              >
                Change Service Date &amp; Time
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                textAlign: "center",
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: 16,
                margin: 10
              }}
            >
              By submitting this work order you acknowledge that all information
              is accurate and you have performed all necessary services.
            </Text>
          </View>

          <View style={{}}>
            <View
              style={{
                marginTop: 7,
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 15,
                paddingVertical: 10,
                paddingHorizontal: 10,
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold" }}
                >
                  Date
                </Text>
                <DatePicker
                  ref="dp"
                  style={{ flex: 1 }}
                  customStyles={{
                    dateInput: { borderWidth: 0 },
                    dateText: { fontSize: 18 }
                  }}
                  date={this.state.customDate}
                  mode="datetime"
                  format="YYYY-MM-DD"
                  // don't allow future dates
                  maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  onDateChange={(dateString, dt) => {
                    this._dateUpdated(dt);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{}}>
            <View
              style={{
                marginTop: 7,
                backgroundColor: "#fff",
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 15,
                paddingVertical: 10,
                paddingHorizontal: 10,
                justifyContent: "space-between"
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold" }}
                >
                  Time
                </Text>
                <DatePicker
                  style={{ flex: 1 }}
                  customStyles={{
                    dateInput: { borderWidth: 0 },
                    dateText: { fontSize: 18 }
                  }}
                  date={this.state.customDate}
                  mode="datetime"
                  format="h:mm a"
                  // don't allow future dates
                  maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  onDateChange={(dateString, dt) => {
                    this._dateUpdated(dt);
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{ margin: 10 }}>
          <Text
            style={{
              textAlign: "center",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: 16,
              margin: 10
            }}
          >
            Services that are not logged at the time they occur are not
            guaranteed and may cause delays in payment.
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: 16,
              margin: 10
            }}
          >
            REMINDER: All services should be logged on-site and when they are
            performed.
          </Text>
        </View>
        <View style={{ flexDirection: "row", padding: 10 }}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => {
              this.props.onSave(this.state.customDate);
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => {
              this.props.onCancel();
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const mapDispatchToProps = {};

const mapStateToProps = state => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceDateChangeScreen);
