import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BusInfoCard, { BusData } from "../../components/BusInfoCard";

const busImages = [
  require("../../assets/images/green_bus.png"),
  require("../../assets/images/blue_bus.png"),
  require("../../assets/images/orange_bus.png"),
  require("../../assets/images/red_bus.png"),
];

const BusMarker = ({ bus, onPress, busImage }: any) => {
  return (
    <Marker
      coordinate={{
        latitude: bus.latitude,
        longitude: bus.longitude,
      }}
      onPress={onPress}
    >
      <Image source={busImage} style={{ width: 30, height: 30 }} />
    </Marker>
  );
};

export default function HomeScreen() {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTrip, setActiveTrip] = useState<any>(null);

  const mapRef = useRef<any>(null);

  const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/locations`;

  const fetchActiveTrip = async () => {
    try {
      const userdata = await AsyncStorage.getItem("userData");
      if (!userdata) return;

      const user = JSON.parse(userdata);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/trip/active/${user.id}`
      );

      const data = await res.json();
      setActiveTrip(data.length > 0 ? data[0] : null);
    } catch {}
  };

  useEffect(() => {
    fetchActiveTrip();
    const interval = setInterval(fetchActiveTrip, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (location) => {
          setUserLocation(location);
        }
      );
    };

    if (!activeTrip) {
      startTracking();
    } else {
      setUserLocation(null);
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [activeTrip]);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const getBusImage = (busName: string) => {
    let hash = 0;
    for (let i = 0; i < busName.length; i++) {
      hash = busName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return busImages[Math.abs(hash) % busImages.length];
  };

  const fetchAllBuses = async () => {
    try {
      const response = await fetch(API_URL);
      const dataArray = await response.json();

      if (Array.isArray(dataArray)) {
        const formatted: BusData[] = dataArray.map((data: any) => {
          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude);

          const smoothLat = lat + (Math.random() - 0.5) * 0.00003;
          const smoothLng = lng + (Math.random() - 0.5) * 0.00003;

          let distanceDisplay = "Calculating...";
          if (userLocation) {
            const km = getDistance(
              userLocation.coords.latitude,
              userLocation.coords.longitude,
              lat,
              lng
            );
            distanceDisplay = `${km} km away`;
          }

          return {
            bus_id: data.bus_id,
            name: data.name || "Unknown Bus",
            model: data.model || "Unknown Model",
            route: data.route || "Unknown Route",
            start_location: data.start_location || "Unknown",
            end_location: data.end_location || "Unknown",
            price: data.price || 0,
            latitude: smoothLat,
            longitude: smoothLng,
            distance: distanceDisplay,
            passengers: data.active_passengers,
          };
        });

        setBuses(formatted);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAllBuses();
    const interval = setInterval(fetchAllBuses, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedBus || !mapRef.current) return;

    mapRef.current.animateToRegion({
      latitude: selectedBus.latitude,
      longitude: selectedBus.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 800);
  }, [selectedBus]);

  useEffect(() => {
    if (!selectedBus || !mapRef.current) return;

    const updated = buses.find(b => b.bus_id === selectedBus.bus_id);
    if (updated) {
      mapRef.current.animateToRegion({
        latitude: updated.latitude,
        longitude: updated.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 800);

      setSelectedBus(updated);
    }
  }, [buses]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 6.9271,
          longitude: 79.8612,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={() => setSelectedBus(null)}
      >
        <UrlTile urlTemplate="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* USER Marker*/}
        {userLocation && !activeTrip && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
          >
            <View style={styles.userMarker}>
              <FontAwesome5 name="street-view" size={14} color="white" />
            </View>
          </Marker>
        )}

        {/* BUS Marker*/}
        {buses.map(bus => (
          <BusMarker
            key={bus.bus_id}
            bus={bus}
            busImage={getBusImage(bus.name)}
            onPress={(e: any) => {
              e.stopPropagation();
              setSelectedBus(bus);
            }}
          />
        ))}
      </MapView>

      <BusInfoCard bus={selectedBus} onClose={() => setSelectedBus(null)} />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text>Scanning For Buses...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  userMarker: {
    backgroundColor: "#0056b3",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
