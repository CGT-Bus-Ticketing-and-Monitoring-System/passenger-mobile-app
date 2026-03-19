import React, {useEffect} from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import {LinearGradient} from 'expo-linear-gradient';

import { useFonts, Pattaya_400Regular} from '@expo-google-fonts/pattaya';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StartupScreen() {
    const router = useRouter();

    let [fontsLoaded] = useFonts({
        'pattaya-regular': Pattaya_400Regular,
    });

    useEffect(() => {
        const checkLoginStatus = async () => {

            
            if (!fontsLoaded) return;

            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time

            try {
                const token = await AsyncStorage.getItem("userToken");

                if (token) {
                    router.replace("/(tabs)/home");
                }
                else
                {
                    router.replace("/login");
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                router.replace("/login");
            }
        };

        checkLoginStatus();
    }, [fontsLoaded, router]);

    if (!fontsLoaded) return null;

    return(
        <LinearGradient
            colors={['#4475A0', '#06202E']}
            style={styles.container}
        >
            <View style={styles.contentContainer}>
                <Image
                    source={require('../assets/images/startup-icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Bus Buddy</Text>
                <Text style={styles.subtitle}>Your very own bus tracking companion</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 150,
        marginBottom: -20,
        tintColor: 'white',
    },
    title: {
        fontSize: 60,
        fontFamily: 'pattaya-regular',
        color: 'white',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: 'thin',
        color: 'white',
    },
});