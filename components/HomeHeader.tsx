import React from "react";
import { StyleSheet, View, Text, Platform, StatusBar } from "react-native";
import { useFonts, Pattaya_400Regular} from '@expo-google-fonts/pattaya';


export default function HomeHeader() {
    let [fontsLoaded] = useFonts({
        'pattaya-regular': Pattaya_400Regular,
    });

    if (!fontsLoaded) {
        return <View style={styles.placeholder} />;
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1f5c9e" />
            <Text style={styles.title}>Bus Buddy</Text>
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
        fontSize: 32,
        fontWeight: "normal",
        fontFamily: 'pattaya-regular',
        letterSpacing: 1,
    },
    placeholder: {
        height: 80,
        backgroundColor: "#004C82",
    }
});