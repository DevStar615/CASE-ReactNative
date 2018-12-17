import React, { Component } from "react";
import { View, Alert } from "react-native";
let base64 = require("base-64");
import { SecureStore } from "expo";
import apiSettings from "./apiSettings";

const userAuthAPI = async (username, password) => {
  // let username = await SecureStore.getItemAsync('username');
  // let password = await SecureStore.getItemAsync('password');
  if (!username || !password) throw Error("missing username/password");
  const response = await fetch(apiSettings.baseUrl + "/api/users/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Basic " + base64.encode(username + ":" + password)
    }
  });
  if (response.ok) return await response.json();
  else throw Error("Your id was not found, please try again or contact us");
};

export default userAuthAPI;
