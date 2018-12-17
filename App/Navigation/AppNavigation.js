import React, { Component } from "react";

import { createStackNavigator } from "react-navigation";
import LoginScreen from "../Components/LoginScreen";
import SelectLocationScreen from "../Components/SelectLocationScreen";
import SelectServiceScreen from "../Components/SelectServiceScreen";
import ServiceTypeScreen from "../Components/ServiceTypeScreen";
import DeIcerScreen from "../Components/DeIcerScreen";
import SiteMapScreen from "../Components/SiteMapScreen";
import TakePictureScreen from "../Components/TakePictureScreen";
import ServiceDateChangeScreen from "../Components/ServiceDateChangeScreen";
import ServiceVerificationScreen from "../Components/ServiceVerificationScreen";
import SubmitScreen from "../Components/SubmitScreen";
import StorybookScreen from "../Components/StorybookScreen";
import InspectionScreen from "../Components/InspectionScreen";
import StartInspectionScreen from "../Components/StartInspectionScreen";
import StartServiceScreen from "../Components/StartServiceScreen";
import InspectionSubmitScreen from "../Components/InspectionSubmitScreen";

export default (Nav = createStackNavigator(
  {
    LoginScreen: { screen: LoginScreen },
    SelectLocationScreen: { screen: SelectLocationScreen },
    ServiceTypeScreen: { screen: ServiceTypeScreen },
    InspectionScreen: { screen: InspectionScreen },
    SelectServiceScreen: { screen: SelectServiceScreen },
    DeIcerScreen: { screen: DeIcerScreen },
    SiteMapScreen: { screen: SiteMapScreen },
    TakePictureScreen: { screen: TakePictureScreen },
    ServiceDateChangeScreen: { screen: ServiceDateChangeScreen },
    ServiceVerificationScreen: { screen: ServiceVerificationScreen },
    SubmitScreen: { screen: SubmitScreen },
    StorybookScreen: { screen: StorybookScreen },
    StartInspectionScreen: { screen: StartInspectionScreen },
    StartServiceScreen: { screen: StartServiceScreen },
    InspectionSubmitScreen: { screen: InspectionSubmitScreen }
  },
  {
    headerMode: "none",
    navigationOptions: {
      gesturesEnabled: false
    },
    initialRouteName: "SelectLocationScreen"
  }
));
