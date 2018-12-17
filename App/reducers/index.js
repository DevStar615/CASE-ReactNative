import { combineReducers, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native

import locationsReducer from "./locationsReducer";
import getLocationReducer from "./getLocationReducer";
import serviceDefinitionReducer from "./serviceDefinitionReducer";
import servicesPerformedReducer from "./servicesPerformedReducer";
import userInfoReducer from "./userInfoReducer";

const rootReducer = combineReducers({
  locationsReducer,
  getLocationReducer,
  serviceDefinitionReducer,
  servicesPerformedReducer,
  userInfoReducer
});

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export let store = createStore(persistedReducer);
export let persistor = persistStore(store);
