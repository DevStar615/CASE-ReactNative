import React, { Component } from "react";
import { AppRegistry, FlatList, StyleSheet, Text, View } from "react-native";

export default class StorybookScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text>All Screens:</Text>
                </View>
                <FlatList
                    data={[
                        { key: "DeIcerScreen" },
                        { key: "LoginScreen" },
                        { key: "SelectLocationScreen" },
                        { key: "SelectServiceScreen" },
                        { key: "ServiceTypeScreen" },
                        { key: "ServiceVerificationScreen" },
                        { key: "SiteMapScreen" },
                        { key: "SubmitScreen" },
                        { key: "TakePictureScreen" }
                    ]}
                    renderItem={({ item }) => (
                        <Text
                            style={styles.item}
                            onPress={() =>
                                this.props.navigation.navigate(item.key)
                            }
                        >
                            {item.key}
                        </Text>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44
    }
});
