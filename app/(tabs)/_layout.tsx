import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeHeader from '../../components/HomeHeader';

export default function Layout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <HomeHeader />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60 + insets.bottom, 
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
            paddingTop: 10,
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarActiveTintColor: '#0056b3',
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: insets.bottom > 0 ? 0 : 10,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color}) => (
              <FontAwesome5 name="home" size={24} color={color} />
            ),
          }} />
        
        <Tabs.Screen 
          name="trips"
          options={{
            title: 'Trips',
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="bus" size={24} color={color} />
            ),
          }} />

        <Tabs.Screen 
          name="routes"
          options={{
            title: 'Routes',
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="map-signs" size={24} color={color} />
            ),
          }} />

        <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="user-circle" size={24} color={color} />
            ),
          }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});