import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreen } from "react-native-screens";

export default function LoginScreen() {
    const router = useRouter();

    //Stating Variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password.");
            return;
        }

        setLoading(true);

        try {
            
            const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/login`; 

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user info in AsyncStorage
                await AsyncStorage.setItem("userToken", data.token);
                await AsyncStorage.setItem("userData", JSON.stringify(data.user));

                Alert.alert("Success", "Logged in successfully!");
                router.replace("/(tabs)/home");
            }
            else 
            {
                Alert.alert("Login Failed", data.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An error occurred during login. Please try again.");
        }
        finally 
        {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Stack.Screen options={{headerShown: false}}/>

            <View style={styles.card}>
                <Text style={styles.headertitle}>Login</Text>

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2E94D4",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "85%",
    },
    headertitle: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#000",
    },
    label: {
       fontSize: 14,
       fontWeight: "600",
       color: "#333",
       marginBottom: 8,
       marginLeft: 4,
    },
    input: {
        backgroundColor: "#E0E0E0",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
        color: "#000",
    },
    button: {
        backgroundColor: "#3EA6FF",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    }
});