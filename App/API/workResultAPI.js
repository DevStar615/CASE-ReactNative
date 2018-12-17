let base64 = require("base-64");
import { SecureStore } from "expo";
import apiSettings from "./apiSettings";
import "geolib";
const uuidv4 = require("uuid/v4");

const request = async (method, uri, data) => {
  let username = await SecureStore.getItemAsync("username");
  let password = await SecureStore.getItemAsync("password");

  const apiResponse = await fetch(uri, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Basic " + base64.encode(username + ":" + password)
    }
  });

  if (apiResponse.status == 401 || apiResponse.status == 403) {
    // clear user/pass so it will bounce them back to auth screen
    // TODO find a more elecant way to do this
    SecureStore.deleteItemAsync("username");
    SecureStore.deleteItemAsync("password");
    throw new Error("login error");
  }

  if (apiResponse.status != 200)
    throw new Error(
      "problem happened on the server: " +
        apiResponse.status +
        " / " +
        (await apiResponse.text())
    );

  return await apiResponse.json();
};

export const startWorkLog = async (location, location_id, data) => {
  if (!location || !location.coords.latitude || !location.coords.longitude)
    throw Error("location data missin");

  let uri = apiSettings.baseUrl + "/api/worklogs";
  let params = {
    id: uuidv4(),
    location_id: location_id,
    location_latitude: location.coords.latitude,
    location_longitude: location.coords.longitude
  };

  if (data) params.data = data;

  const responseJson = await request("POST", uri, params);

  if (!responseJson.id)
    alert.alert("An issue occurred when communiting with the CaseSnow servers");

  // return the id so it can be used to add data to this log
  return responseJson;
};

export const updateWorkLog = async (workId, location, stateData) => {
  if (!location || !location.coords.latitude || !location.coords.longitude)
    throw Error("location data missin");

  let uri = apiSettings.baseUrl + `/api/worklogs/${workId}`;
  let params = {
    id: workId,
    location_latitude: location.coords.latitude,
    location_longitude: location.coords.longitude,
    data: stateData
  };
  const responseJson = await request("PUT", uri, params);

  if (!responseJson.id)
    alert.alert("An issue occurred when communiting with the CaseSnow servers");

  // return the id so it can be used to add data to this log
  return responseJson;
};

export const submitWorkLog = async (workId, location, stateData) => {
  if (!location || !location.coords.latitude || !location.coords.longitude)
    throw Error("location data missin");

  let uri = apiSettings.baseUrl + `/api/worklogs/${workId}`;
  let params = {
    id: workId,
    location_latitude: location.coords.latitude,
    location_longitude: location.coords.longitude,
    submitted: true,
    data: stateData
  };
  const responseJson = await request("PUT", uri, params);

  if (!responseJson.id)
    alert.alert("An issue occurred when communiting with the CaseSnow servers");

  // return the id so it can be used to add data to this log
  return responseJson.id;
};

export const uploadImageAsync = async (id, uri) => {
  var filename = uri
    .split("/")
    .slice(-1)[0]
    .toLowerCase();

  console.log("starting image upload", filename);
  let username = await SecureStore.getItemAsync("username");
  let password = await SecureStore.getItemAsync("password");

  let apiUrl = apiSettings.baseUrl + `/api/worklogs/${id}/images`;

  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1].toLowerCase();

  if (!filename.endsWith(fileType)) filename += `.${fileType}`;

  let formData = new FormData();
  formData.append("file", {
    uri,
    name: filename,
    type: `image/${fileType}`
  });

  let options = {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: "Basic " + base64.encode(username + ":" + password)
    }
  };

  return fetch(apiUrl, options);
};
