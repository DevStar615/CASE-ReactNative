import apiSettings from "./apiSettings";
import { SecureStore } from "expo";
let base64 = require("base-64");

export default (getUserInfoAPI = async () => {
  let username = await SecureStore.getItemAsync("username");
  let password = await SecureStore.getItemAsync("password");
  if (!username || !password) throw new Error("missing auth");

  const uri = `${apiSettings.baseUrl}/api/users/me`;
  const response = await fetch(uri, {
    method: "GET",
    headers: {
      Authorization: "Basic " + base64.encode(username + ":" + password)
    }
  });
  console.log(response.headers, response.data);
  if (response.status != 200)
    throw new Error("problem happened on the server: " + response.status);
  const responseJson = await response.json();
  console.log("userInfo", responseJson);
  return responseJson;
});
