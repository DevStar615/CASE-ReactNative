const serviceDefinitionReducer = (
  state = { serviceDefinition: null },
  action
) => {
  switch (action.type) {
    case "SET_SERVICE_DEFINITION":
      return { ...state, serviceDefinition: action.payload };
    default:
      return state;
  }
};
export default serviceDefinitionReducer;
