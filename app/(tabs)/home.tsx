import React,{useState, useEffect} from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import MapView, {Marker, UrlTile} from "react-native-maps";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

//importing the BusInfoCard component
import BusInfoCard, { BusData } from "../../components/BusInfoCard";

export default function HomeScreen() {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/locations`; //Replace with your actual API endpoint

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    fetchAllBuses();
    const interval = setInterval(() => {
      fetchAllBuses();
    }, 2000); // Fetch every 2 seconds
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [userLocation]);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1); // Distance in km
  };

  const fetchAllBuses = async () => {
    try {
      const response = await fetch(API_URL);
      const dataArray = await response.json();

      if (Array.isArray(dataArray)) {
        
        const formattedBuses: BusData[] = dataArray.map((data: any) => {
          let distanceDisplay = "Calculating...";
          if (userLocation) {
            const km = getDistance(
              userLocation.coords.latitude, userLocation.coords.longitude, 
              parseFloat(data.latitude), parseFloat(data.longitude)
            );
            distanceDisplay = `${km} km away`;
          }
            return {
              name: data.name || "Unknown Bus",
              model: data.model || "Unknown Model",
              route: data.route || "Unknown Route",
              start_location: data.start_location || "Unknown Start Location",
              end_location: data.end_location || "Unknown End Location",
              price: data.price || 0,
              latitude: parseFloat(data.latitude),
              longitude: parseFloat(data.longitude),
              distance: distanceDisplay,
              passengers: data.active_passengers,
            };
        });

        setBuses(formattedBuses);
        setLoading(false);
      }
    }
    catch (error) {
      //Silently fail and retry on the next interval
      console.error("Error fetching bus location:", error);
    }
  };

  return (
    <View style={styles.container}>
      
      {/*Map Initialization*/}
      <MapView 
      style={styles.map}
      provider={undefined}
      onPress={() => setSelectedBus(null)} //click map to close the card
      region={{
        latitude: userLocation ? userLocation.coords.latitude : 6.9271,
        longitude: userLocation ? userLocation.coords.longitude : 79.8612,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      >
        <UrlTile 
          urlTemplate="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} zIndex={1}
        />

        {/*user marker*/}
        {userLocation && (
          <Marker 
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude
            }}
            title="Your Location"
          >
            <View style={styles.userMarker}>
              <Ionicons name="person" size={14} color="white" />
            </View>
          </Marker>
        )}

        {/*bus marker*/}
        {buses.map((bus, index) => (
          <Marker 
            key={index}
            coordinate={{ latitude: bus.latitude, longitude: bus.longitude}}
            zIndex={10}
            tracksInfoWindowChanges={false}
            onPress={(e) => {
              e.stopPropagation(); 
              setSelectedBus(bus);
            }}
          >
            <View style={styles.busMarker}>
              <FontAwesome5 name="bus" size={16} color="white" />
            </View>
          </Marker>
        ))
        }
      </MapView>
        {/*Bus Card*/}
        {selectedBus && <BusInfoCard bus={selectedBus} />}

        {/*Loading Indicator*/}
        {loading && buses.length === 0 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0056b3" />
            <Text style={{marginTop: 10}}>Scanning For Buses...</Text>
          </View>
        )}

        {errorMsg && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  busMarker: {
    backgroundColor: "#D32F2F", padding: 8, borderRadius: 20, borderWidth: 2, borderColor: "white", elevation: 4,
  },
  userMarker: {
    backgroundColor: "#0056b3", padding: 8, borderRadius: 20, borderWidth: 2, borderColor: "white", elevation: 4,
  },
  loadingOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255,255,255,0.8)"
  },
  errorContainer: {
    position: "absolute", top: 50, alignSelf: "center", backgroundColor: "red", padding: 10, borderRadius: 5 
  },
  errorText: {color: "white", fontWeight: "bold"}
});