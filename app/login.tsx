import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();

    //Stating Variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [isPasswordVisible, setPasswordVisible] = useState(false);

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
        <LinearGradient
            colors={['#4475A0', '#06202E']}
            style={styles.gradientBackground}
        >
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
                        placeholderTextColor="#808080"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor="#808080"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setPasswordVisible(!isPasswordVisible)}
                        >
                            <Ionicons 
                                name={isPasswordVisible ? "eye-off" : "eye"}
                                size={20}
                                color= "white"
                            />
                        </TouchableOpacity>
                    </View>
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
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    gradientBackground: {
        flex: 1
    },
    card: {
        backgroundColor: "rgba(235, 235, 235, 0.4)",
        borderRadius: 20,
        padding: 20,
        width: "85%",
    },
    headertitle: {
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 40,
        marginTop: 30,
        color: "white",
    },
    label: {
       fontSize: 14,
       fontWeight: "600",
       color: "white",
       marginBottom: 8,
       marginLeft: 4,
    },
    input: {
        backgroundColor: "rgba(217, 217, 217, 0.57)",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
        color: "white",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(217, 217, 217, 0.57)",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
        marginBottom: 20,
        padding: 5,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16
    },
    eyeIcon: {
        paddingRight: 10,
    },
    button: {
        backgroundColor: "#022137",
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