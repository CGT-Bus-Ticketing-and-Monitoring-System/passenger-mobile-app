import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface passwordInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  placeholder: string;
}


const PasswordInput = ({ label, value, onChange, show, setShow, placeholder }: passwordInputProps) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          secureTextEntry={!show}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShow(!show)}
        >
          <Ionicons
            name={show ? "eye-off" : "eye"}
            size={24}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    const current = currentPassword.trim();
    const newPass = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !newPass || !confirm) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Error", "New Passwords do not match");
      return;
    }
    if (newPass.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/change_password`;

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: current,
          newPassword: newPass,
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Password Changed Successfully");
        router.back();
      }
      else
      {
        Alert.alert("Failed", data.message || "Could not change password");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network error. Please try again");
    }
    finally 
    {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4475A0', '#06202E']} style={styles.gradientBackground}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >

      <Stack.Screen options={{
        headerTitle:"Update Password",
        headerStyle: { backgroundColor: '#022137' },
        headerTintColor: '#fff',
        headerShadowVisible: false,
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <PasswordInput
          label="Enter Current Password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
          placeholder=""
        />

        <PasswordInput
          label="Enter New Password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          setShow={setShowNew}
          placeholder=""
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
          placeholder=""
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Change Password</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: { 
    flex: 1,
  },
  scrollContent: {
    padding: 25,
    paddingTop: '40%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(174, 184, 191, 0.49)',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,
    shadowColor: '#26aab3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'white',
  },
  eyeIcon: {
    padding: 15,
  },
  saveButton: {
    backgroundColor: '#022137',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#26aab3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
