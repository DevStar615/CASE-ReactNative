import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    flexDirection: "row",
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginVertical: 5
  },
  text1: {
    fontSize: 15,
    color: "#231F20"
    //fontFamily: "Univers LT Std"
  },
  milesText: {
    fontSize: 16,
    lineHeight: 18,
    color: "#231F20",
    //fontFamily: "Univers LT Std",
    textAlign: "right"
  },
  heading1: {
    fontSize: 32,
    letterSpacing: 0,
    color: "#fff",
    //fontFamily: "Univers LT Std";
    textAlign: "center",
    marginTop: 10,
    paddingVertical: 15
  },
  text2: {
    fontSize: 21,
    letterSpacing: 0,
    color: "#fff",
    //fontFamily: "Univers LT Std";
    fontWeight: "300",
    textAlign: "center"
  },
  searchBox: {
    borderColor: "#fff",
    borderWidth: 1,
    marginHorizontal: 15,
    paddingVertical: 13,
    marginTop: 10,
    flexDirection: "row"
  },
  textInput: {
    paddingHorizontal: 10,
    flex: 0.85
  }
});
