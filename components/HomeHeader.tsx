import React from "react";
import { StyleSheet, View, Text, Platform, StatusBar } from "react-native";

export default function HomeHeader() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1f5c9e" />
            <Text style={styles.title}>Obsidian Bus{'\n'}Tracking</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1f5c9e",
        paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0)  + 10 : 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        zIndex: 10,   
    },
    title: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        lineHeight: 30,
    },
});