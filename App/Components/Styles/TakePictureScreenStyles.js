import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    box: {
        backgroundColor: "#A0C8E2",
        flexDirection: "row",
        marginHorizontal: 15,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginVertical: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    locationBox: {
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
        color: "#231F20",
        paddingVertical: 1
        //fontFamily: "Univers LT Std"
    },
    boldText: {
        fontSize: 25,
        letterSpacing: 0,
        color: "#231F20",
        //fontFamily: "Univers LT Std";
        fontWeight: "bold",
        marginLeft: 20
    },
    headingText: {
        fontSize: 35,
        letterSpacing: 0,
        color: "#ffffff",
        //fontFamily: "Univers LT Std"
        textAlign: "center"
    },
    lowerBox: {
        backgroundColor: "#A0C8E2",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 25
    }
});
