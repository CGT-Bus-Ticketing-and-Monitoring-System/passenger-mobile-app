import React, { useState, useCallback, use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export interface userData {
  first_name: string;
  last_name: string;
  username: string;
  card_uid: string;
  balance: string | number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<userData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = async () => {
    try {
      const storageData = await AsyncStorage.getItem("userData");
      if (storageData) {
        setUser(JSON.parse(storageData));
      }

      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const timestamp = new Date().getTime();
        const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/profile?t=${timestamp}`;

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const freshData = await response.json();
          setUser(freshData);
          await AsyncStorage.setItem("userData", JSON.stringify(freshData));
        }
      }
    } catch (error) {
      console.log("Failed to Sync live user data:", error);
    }
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /*const loadUserData = async () => {
    console.log("====================================");
    console.log("🔄 STARTING LIVE PULL-TO-REFRESH 🔄");
    try {
      // 1. Load the local snapshot
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        setUser(JSON.parse(storedData));
        console.log("📱 Loaded old data from AsyncStorage");
      }

      // 2. Get the token
      const token = await AsyncStorage.getItem("userToken");
      console.log("🔑 Token exists?", !!token);

      if (token) {
        // Force the URL to bypass the Android network cache
        const timestamp = new Date().getTime();
        const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/profile?t=${timestamp}`; 
        
        console.log("🌐 Hitting Backend URL:", API_URL);

        // 3. Make the API request
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("🚦 Backend Status Code:", response.status);

        if (response.ok) {
          const freshData = await response.json();
          console.log("✅ SUCCESS! Fresh Balance is:", freshData.balance);
          setUser(freshData); 
          await AsyncStorage.setItem("userData", JSON.stringify(freshData)); 
        } else {
          const errorText = await response.text();
          console.log("❌ SERVER REJECTED THE REQUEST:", errorText);
        }
      } else {
        console.log("⚠️ No token found in AsyncStorage! User is basically logged out.");
      }
    } catch (error) {
      console.log("💥 MASSIVE NETWORK CRASH:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); 
      console.log("🏁 PULL-TO-REFRESH FINISHED 🏁");
      console.log("====================================");
    }
  };*/

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Logout" ,"Are you sure you want to Log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(['userToken', 'UserData']);
          router.replace('/login');
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'large'} color={'#0056b3'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username || "Passenger"}
          </Text>
          <Text style={styles.cardId}>
            Card ID: {user?.card_uid ? user.card_uid : "No Card Linked"}
          </Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Account Balance</Text>
          <Text style={styles.balanceAmount}>
            LKR {user?.balance ? parseFloat(String(user.balance)).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2}) : "0.00"}
          </Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <ScrollView
          contentContainerStyle={styles.menuContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadUserData} />}
        >
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/update_credentials')}
          >
            <View>
              <Text style={styles.menuTitle}>Update Profile</Text>
              <Text style={styles.menuSubtitle}>Credentials</Text>
            </View>
            <Ionicons name='person' size={28} color='black' />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/change_password')}
          >
            <View>
              <Text style={styles.menuTitle}>Change</Text>
              <Text style={styles.menuSubtitle}>Password</Text>
            </View>
            <Ionicons name='shield-checkmark' size={28} color='black' />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={handleLogout}
          >
            <View>
              <Text style={styles.menuTitle}>Logout</Text>
            </View>
            <Ionicons name='log-out-outline' size={28} color='black' />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  infoSection: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 25,
  },
  userInfo: {
    marginBottom: 20,
  },
  userName: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardId: {
    color: '#555',
    fontSize: 14,
  },
  balanceContainer: {
    marginTop: 10,
  },
  balanceLabel: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  balanceAmount: {
    color: 'black',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 5,
  },
  menuWrapper: {
    flex: 1,
    backgroundColor: '#CAE3FF',
  },
  menuContainer: {
    marginTop: 40,
    padding: 20, 
    gap: 30,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  menuSubtitle: {
    fontSize: 16, 
    fontWeight: '400',
    color: '#333',
  }
});

