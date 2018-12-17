import React, { Component } from "react";
import Sentry from "sentry-expo";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import AppBar from "../AppBar";
import { styles } from "../Styles/SelectLocationScreenStyles";
import locationAPI from "../../API/locationsAPI";
import { connect } from "react-redux";
import { setLocations, selectLocation, setUserInfo } from "../../actions/index";
import BottomBar from "../BottomBar";
import getCurrentLocation from "../../helpers/currentLocation";
import { Constants } from "expo";
import { getLocationImageUrl } from "../../API/locationImageAPI";
import getUserInfoAPI from "../../API/getUserInfoAPI";
import LocationListItem from "./LocationListItem";

class SelectLocationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localData: [],
      data: [],
      refreshing: true,
      searchText: "",
      searchResults: this.props.locations || [],
      location: null
    };
    if (this.props.selectedLocation) {
      this.props.navigation.navigate("ServiceTypeScreen");
    }
  }

  renderBox = ({ item }) => {
    return (
      <LocationListItem
        item={item}
        onPress={() => {
          this.props.selectLocation(item);
          this.props.navigation.navigate("ServiceTypeScreen");
        }}
      />
    );
  };

  async _checkVersionUpdate() {
    try {
      const update = await Expo.Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert("App updating...");
        await Expo.Updates.fetchUpdateAsync();
        await Expo.Updates.reloadFromCache();
      }
    } catch (e) {
      if (e.message == "Cannot check for updates in dev mode") return;
      Sentry.captureException(err);
      console.log("_checkVersionUpdate error:", e);
      Alert.alert("Error Checking Version", `${e}`);
    }
  }

  search = async searchText => {
    this.setState({ refreshing: true });

    // remember last search text for pull to refresh
    if (searchText !== undefined) {
      this.setState({ lastSearchText: searchText });
    }

    // --- version check

    // currently waiting search results for this because we are rolling out features to everyone to use on the same day
    this.setState({ refreshingMessage: "Checking version..." });
    try {
      await this._checkVersionUpdate();
    } catch (e) {
      console.error(e);
    }

    // --- get location for search results

    this.setState({ refreshingMessage: "Acquiring location..." });
    try {
      let locationResult = await getCurrentLocation();
      console.log("locationResult", locationResult);
      this.setState({ location: locationResult });
    } catch (e) {
      console.log(e);
      Alert.alert("Problem getting location: ", `${e}`);
    }

    this.setState({
      refreshingMessage: "Getting locations from CaseSnow..."
    });

    if (!searchText) searchText = "";
    try {
      console.log("searching...");
      this.setState({
        refreshingMessage: "Getting locations from CaseSnow..."
      });
      res = await locationAPI(this.state.location, searchText || "");
    } catch (e) {
      console.log("ERROR SEARCHING", e);
      if (`${e}`.indexOf("missing auth") > -1) {
        return this.props.navigation.navigate("LoginScreen");
      } else if (e.message.indexOf("Network request failed") > -1) {
        this.setState({ errorMessage: "Error: " + e.message });
        this.setState({ offline: true });
      }

      this.setState({ refreshing: false });
      this.props.navigatifon.navigate("LoginScreen");
    }

    if (!res) res = [];
    let seenUrls = [];

    let locationsArray = res.map(location => {
      location["key"] = String(location.id);
      location["id"] = String(location.id);

      location.services.map(s => {
        if (s.definition_file_ids) {
          for (const id of s.definition_file_ids) {
            const url = getLocationImageUrl(id, id);
            if (!url) return;
            if (!seenUrls.indexOf(url)) {
              Image.prefetch(url);
              seenUrls.push(url);
            }
          }
        }
      });

      return location;
    });
    locationsArray = locationsArray.sort((a, b) => a.distance > b.distance);
    this.props.setLocations(locationsArray); // remember locations in case offline in a minute

    // --- check user identity

    this.setState({ refreshingMessage: "Confirming user details..." });
    // check once per app load just to make sure it's fresh
    if (!this.state.userInfo) {
      let userInfoResult = await getUserInfoAPI();
      this.props.setUserInfo(userInfoResult);
      this.setState({ userInfo: userInfoResult });
    }

    this.setState({
      searchResults: locationsArray,
      refreshing: false,
      refreshingMessage: ""
    });
  };

  async componentDidMount() {
    this.search();
  }

  offlineWarning() {
    if (this.state.offline)
      return (
        <View style={{}}>
          <Text
            style={{
              fontSize: 30,
              textAlign: "center",
              color: "red",
              fontStyle: "italic"
            }}
          >
            Connection offline
          </Text>
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              color: "red",
              fontStyle: "italic"
            }}
          >
            These results might be out of date
          </Text>
        </View>
      );
  }

  _androidRefreshStatus() {
    if (Platform.OS === "android" && this.state.refreshing)
      return (
        <Text
          style={{
            color: "white",
            textAlign: "center"
          }}
        >
          {this.state.refreshingMessage}
        </Text>
      );
  }
  _errorMessage() {
    if (this.state.errorMessage)
      return (
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold"
          }}
        >
          {this.state.errorMessage}
        </Text>
      );
  }
  render() {
    const { locations } = this.props;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Constants.statusBarHeight}
      >
        <AppBar navigation={this.props.navigation} />
        <ImageBackground
          style={{ flex: 1 }}
          source={require("../../Assets/HomeScreenBackground.png")}
        >
          <View
            style={{
              flex: 1
            }}
          >
            <Text style={styles.heading1}>Select Location</Text>
            {/* {this.offlineWarning()} */}

            {this._androidRefreshStatus()}

            {this._errorMessage()}

            <FlatList
              data={this.state.searchResults}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderBox}
              keyExtractor={item => item.id}
              refreshControl={this._refreshControl()}
            />
          </View>
          <BottomBar search={this.search.bind(this)} />
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }

  _refreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={() => this.search(this.state.lastSearchText)}
        title={this.state.refreshingMessage || "Refreshing locations..."}
      />
    );
  }
}

const mapStateToProps = state => ({
  locations: state.locationsReducer.locations,
  selectedLocation: state.getLocationReducer.selectedLocation,
  selectedServiceDefinition: state.serviceDefinitionReducer.serviceDefinition,
  servicesPerformed: state.servicesPerformedReducer.servicesPerformed,
  userInfo: state.userInfoReducer.userInfo
});
const actions = {
  setLocations,
  selectLocation,
  setUserInfo
};
export default connect(
  mapStateToProps,
  actions
)(SelectLocationScreen);
