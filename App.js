import { Text } from "react-native";
Text.defaultProps.allowFontScaling = false;

import Sentry from "sentry-expo";
// Sentry.enableInExpoDevelopment = true;
Sentry.config(
  "https://cfc544c117ff476d8256574d719e1694@sentry.io/1317065"
).install();

import React from "react";
import { Platform, View } from "react-native";
import Nav from "./App/Navigation/AppNavigation";
import { Provider } from "react-redux";
import { store, persistor } from "./App/reducers/index";
import { Constants } from "expo";
import { PersistGate } from "redux-persist/integration/react";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#2884C6",
              paddingTop: Constants.statusBarHeight
            }}
          >
            <Nav />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
