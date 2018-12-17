const locationsReducer = (state = { locations: [] }, action) => {
  switch (action.type) {
    case "SET_LOCATIONS":
      return { ...state, locations: action.payload };
    default:
      return state;
  }
};

export default locationsReducer;
