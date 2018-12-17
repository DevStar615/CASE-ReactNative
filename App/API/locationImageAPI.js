import "geolib";
import { SecureStore } from "expo";
let base64 = require("base-64");
import apiSettings from "./apiSettings";

export const getLocationImageUrl = (locationId, imageId) => {
  if (!locationId || !imageId)
    throw Error("location and image ids required: " + [locationId, imageId]);

  return `${apiSettings.baseUrl}/api/locations/${imageId}/images/${imageId}`;

  //   const response = await fetch(
  //     `${apiSettings.baseUrl}/api/locations/${locationId}/images/${imageId}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: "Basic " + base64.encode(username + ":" + password)
  //       }
  //     }
  //   );
  //   console.log(response);
  //   return response.data;
};
