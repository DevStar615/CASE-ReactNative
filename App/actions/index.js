export const setLocations = locations => {
  return {
    type: "SET_LOCATIONS",
    payload: locations
  };
};

export const selectLocation = location => {
  return {
    type: "GET_LOCATION",
    payload: location
  };
};

export const selectServiceDefinition = sd => {
  return {
    type: "SET_SERVICE_DEFINITION",
    payload: sd
  };
};

export const setServicesPerformed = payload => {
  return {
    type: "SET_SERVICES_PERFORMED",
    payload: payload
  };
};

export const getUserInfo = () => {
  return {
    type: "GET_USER_INFO"
  };
};

export const setUserInfo = payload => {
  return {
    type: "SET_USER_INFO",
    payload: payload
  };
};
