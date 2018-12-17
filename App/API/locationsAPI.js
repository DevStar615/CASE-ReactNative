import "geolib";
import { SecureStore } from "expo";
let base64 = require("base-64");
import apiSettings from "./apiSettings";
import { Constants } from "expo";

const locationAPI = async (location, searchText) => {
  if (!location) throw Error("location missing");

  let username = await SecureStore.getItemAsync("username");
  let password = await SecureStore.getItemAsync("password");
  if (!username || !password) throw new Error("missing auth");

  if (searchText && typeof searchText !== "string")
    throw Error("searchtext bad type: " + typeof searchText);

  let params = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    searchText: searchText || ""
  };
  if (!params.latitude || !params.longitude)
    throw Error("Location missing in API call");
  var queryString = Object.keys(params)
    .map(key => {
      return (
        encodeURIComponent(key) + "=" + encodeURIComponent(params[key]).trim()
      );
    })
    .join("&");
  const url = apiSettings.baseUrl + "/api/locations?" + queryString;
  const headers = {
    "x-client-info": JSON.stringify([
      Constants.deviceName,
      Constants.deviceId,
      Constants.installationId,
      Constants.sessionId,
      Constants.platform
    ]),
    pragma: "no-cache",
    "cache-control": "no-cache",
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Basic " + base64.encode(username + ":" + password)
  };
  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers: headers
  });
  if (response.status == 401 || response.status == 403) {
    // clear user/pass so it will bounce them back to auth screen
    // TODO find a more elecant way to do this
    SecureStore.deleteItemAsync("username");
    SecureStore.deleteItemAsync("password");
    throw new Error("login error");
  }
  if (response.status != 200)
    throw new Error("problem happened on the server: " + response.status);
  const responseJson = await response.json();
  for (let i = 0; i < responseJson.length; i++) {
    let row = responseJson[i];
    let locationLat = row.shippinglatitude || row.billinglatitude;
    let locationLon = row.shippinglongitude || row.billinglongitude;

    // if we can't calculate distance, leave it blank
    if (!locationLat || !locationLon) {
      row["distance"] = null;
      continue;
    }

    row["distance"] = geolib.getDistance(
      {
        latitude: locationLat,
        longitude: locationLon
      },
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    );
    // convert to miles
    row["distance"] = row["distance"] * 0.000621371;
  }
  return responseJson;
};

export default locationAPI;
