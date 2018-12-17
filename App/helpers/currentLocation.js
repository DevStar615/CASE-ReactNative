import { Location, Permissions, Linking, Constants } from "expo";
import { Alert, Platform } from "react-native";

const _locationServiceError = () => {
  Alert.alert(
    "Location Services Needed",
    "This app needs your location to find nearby jobs, click ok to open settings and grant access",
    [
      {
        text: "Open Settings",
        onPress: () => Linking.openURL("app-settings:")
      }
    ],
    { cancelable: false }
  );
};

const getCurrentLocation = async () => {
  // workaround: android emulator doesn't send location to app
  // also found android runs via adb will never get location response
  if (Platform.OS === "android" && Constants.manifest.debuggerHost) {
    const boston = {
      coords: {
        accuracy: 5,
        altitude: 0,
        altitudeAccuracy: -1,
        heading: -1,
        latitude: 42.3601,
        longitude: -71.0589,
        speed: -1
      }
      // "timestamp": 1540153695544.5608,
    };
    console.log("In android debuger, returning boston location.");
    return boston;
  }

  let status;
  try {
    let permres = await Permissions.askAsync(Permissions.LOCATION);
    status = permres.status;
  } catch (e) {
    console.log("Error getting location permission:", e);
    return _locationServiceError();
  }

  if (status == "granted") {
    const ONE_MINUTE = 60 * 1000;
    // stopped using enableHighAccuracy:false because it was making timeout happen on android devices
    var opts = { maximumAge: ONE_MINUTE * 5 };
    return Location.getCurrentPositionAsync(opts);
    // not catching exceptions here, they are caught by caller
  } else {
    _locationServiceError();
  }
};

export default getCurrentLocation;
