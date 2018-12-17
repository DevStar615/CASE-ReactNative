//======================================Screen7 Deicer Screen Styles==========
import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    deIcerText: {
        fontSize: 40,
        letterSpacing: 0,
        color: "#ffffff",
        //fontFamily: "Univers LT Std";
        fontWeight: "800",
        textAlign: "center"
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
    text1: {
        fontSize: 15,
        color: "#231F20"
        //fontFamily: "Univers LT Std"
    },
    bigLabel: {
        fontSize: 21.5,
        letterSpacing: 0,
        color: "#ffffff",
        //fontFamily: "Univers LT Std";
        fontWeight: "bold",
        textAlign: "center",
        marginHorizontal: 20
    },
    shortLabel: {
        fontSize: 16,
        letterSpacing: 0,
        color: "#ffffff",
        //font-family: "Univers LT Std";
        fontWeight: "300",
        position: "absolute",
        right: Dimensions.get("window").width / 2 + 45
    }
});
