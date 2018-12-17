import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  imageBackground: {
    flex: 1
  },
  headingText: {
    fontSize: 32,
    letterSpacing: 0,
    color: "#fff",
    //fontFamily: "Univers LT Std";
    textAlign: "center",
    paddingVertical: 10,
    flex: 0.1
  },
  iconText: {
    color: "#231F20",
    fontSize: 21,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginVertical: 5
  },
  serviceBox: {
    backgroundColor: "#A0C8E2",
    alignItems: "center",
    marginHorizontal: 5,

    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    margin: 5,

    padding: 10
  },
  serviceIcon: {
    height: 50,
    width: 50
  },
  box: {
    backgroundColor: "#A0C8E2",
    flexDirection: "row",
    marginHorizontal: 40,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: 15,
    marginBottom: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2884C6"
  },
  name: {
    color: "white"
  },
  text1: {
    fontSize: 15,
    color: "#231F20"
    //fontFamily: "Univers LT Std"
  }
});
