const servicesPerformedReducer = (state = { selectedServices: {} }, action) => {
  switch (action.type) {
    case "SET_SERVICES_PERFORMED":
      return { ...state, servicesPerformed: action.payload };
    default:
      return state;
  }
};

export default servicesPerformedReducer;
