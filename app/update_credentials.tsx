import React, {useState, useEffect} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";

import ProfileScreen, {userData} from "./(tabs)/profile";

export default function UpdateCredentialsScreen() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);

  //State for Form fields
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: ''
  });

  //Pre fill values logic
  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    try {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setForm({
          first_name: parsed.first_name || '',
          last_name: parsed.last_name || '',
          username: parsed.username || '',
          email: parsed.email || '',
          phone: parsed.phone || ''
        });
      }
    } catch (error) {
      console.log("Error loading user data: ", error);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      //Ensure this IP matches your computer IP in .env
      const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/update`;

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userData", JSON.stringify(data.user));

        Alert.alert("Success", "Profile updated successfully");
        router.back();
      }
      else
      {
        Alert.alert("Error", data.message || "Update failed");
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Network error. Is Backend Running?");
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
      <Stack.Screen options={{headerTitle:"Update Credentials"}} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Update Profile</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput 
            style={styles.input}
            value={form.first_name}
            onChangeText={(text) => setForm({...form, first_name: text})}
            placeholder="Enter First Name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput 
            style={styles.input}
            value={form.last_name}
            onChangeText={(text) => setForm({...form, last_name: text})}
            placeholder="Enter Last Name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            style={[styles.input, styles.disabledInput]}
            value={form.username}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput 
            style={styles.input}
            value={form.phone}
            keyboardType="phone-pad"
            onChangeText={(text) => setForm({...form, phone: text})}
            placeholder="07X XXX XXXX"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input}
            value={form.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setForm({...form, email: text})}
            placeholder="example@gmail.com"
          />
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Update Credentials</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFE0FF',
  },
  scrollContent: {
    padding: 25,
    paddingTop: 60,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F4C81',
    marginBottom: 30,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  disabledInput: {
    backgroundColor: '#EBEBEB',
    color: '#777',
  },
  updateButton: {
    backgroundColor: '#3EA6FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});