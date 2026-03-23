import React,{useState, useEffect, useRef} from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image, Animated } from "react-native";
import MapView, {Marker, UrlTile, AnimatedRegion} from "react-native-maps";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

//importing the BusInfoCard component 
import BusInfoCard, { BusData } from "../../components/BusInfoCard";

const busImages = [
  require("../../assets/images/green_bus.png"),
  require("../../assets/images/blue_bus.png"),
  require("../../assets/images/orange_bus.png"),
  require("../../assets/images/red_bus.png"),
]

const AnimatedBusMarker = ({ 
  bus, 
  onPress, 
  busImage
}: { 
  bus: BusData; 
  onPress: (e: any) => void; 
  busImage: any; 
}) => {
  const coordinate = React.useRef(
    new AnimatedRegion({
      latitude: bus.latitude,
      longitude: bus.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  ).current;

  React.useEffect(() => {
    // @ts-ignore
    coordinate.timing({
      latitude: bus.latitude,
      longitude: bus.longitude,
      duration: 1500, 
      useNativeDriver: false,
    }).start();
  }, [bus.latitude, bus.longitude]);

  return (
    <Marker.Animated
      // @ts-ignore
      coordinate={coordinate}
      zIndex={10}
      tracksInfoWindowChanges={false}
      onPress={onPress}
    >
      <Image 
        source={busImage}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />
    </Marker.Animated>
  );
}

 
export default function HomeScreen() {
  const [buses, setBuses] = useState<BusData[]>([]);
  //const [prevBuses, setPrevBuses] = useState<{[key: number]: BusData}>({});
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTrip, setActiveTrip] = useState(null);

  const hintOpacity = useRef(new Animated.Value(0)).current;
  const hintTranslateY = useRef(new Animated.Value(-20)).current;

  const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/passenger/locations`; //Replace with your actual API endpoint

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
    } catch (e) {}
  };

  useEffect(() => {
    fetchActiveTrip();
    const interval = setInterval(fetchActiveTrip, 3000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    Animated.sequence([
      Animated.delay(2000), 
      Animated.parallel([   
        Animated.timing(hintOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(hintTranslateY, { toValue: 0, duration: 600, useNativeDriver: true })
      ]),
      Animated.delay(4000), 
      Animated.parallel([   
        Animated.timing(hintOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(hintTranslateY, { toValue: -20, duration: 500, useNativeDriver: true })
      ])
    ]).start();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5
        },
        (location) => {
          setUserLocation(location);
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
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

  /*const getHeading = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);

    const x = 
      Math.cos(lat1 * Math.PI / 180) * 
        Math.sin(lat2 * Math.PI / 180) -
      Math.sin(lat1 * Math.PI / 180) * 
        Math.cos(lat2 * Math.PI / 180) *
        Math.cos(dLon);

    let brng = Math.atan2(y, x);

    brng = brng * (180 / Math.PI);

    return (brng + 360) % 360;
  }*/

  const getBusImage = (busName: string) => {
    let hash = 0;

    for (let i = 0; i < busName.length; i++) {
      hash = busName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % busImages.length;

    return busImages[index];
  }

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

          /*
          const prev = prevBuses[data.bus_id];

          let heading = 0;

          if (prev) {
            heading = getHeading(
              prev.latitude,
              prev.longitude,
              parseFloat(data.latitude),
              parseFloat(data.longitude)
            );
          }
          */

          return {
            bus_id: data.bus_id,

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

            //heading
          };
        });

        setBuses(formattedBuses);

        const map:any = {};

        formattedBuses.forEach(b => {
          map[b.bus_id] = b;
        });

        //setPrevBuses(map);

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
        {userLocation && !activeTrip && (
          <Marker 
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude
            }}
            title="Your Location"
            anchor={{x: 0.5, y: 1}}
          >
            <View style={styles.userMarker}>
              <FontAwesome5 name="street-view" size={14} color="white" />
            </View>
          </Marker>
        )}

        {/*bus marker*/}
        {buses.map((bus, index) => (
          <AnimatedBusMarker
            key={bus.bus_id}
            bus={bus}
            busImage={getBusImage(bus.name)}

            onPress={(e) => {
              e.stopPropagation(); 
              setSelectedBus(bus);
            }}
          />
        ))
        }
      </MapView>

      <Animated.View
        pointerEvents="none" 
        style={[
          styles.hintPill, 
          { 
            opacity: hintOpacity, 
            transform: [{ translateY: hintTranslateY }] 
          }
        ]}
      >
        <FontAwesome5 name="hand-pointer" size={14} color="#00E5FF" style={{ marginRight: 8 }} />
        <Text style={styles.hintText}>Tap a bus to view live details</Text>
      </Animated.View>

        {activeTrip && (
          <View style={{
            position: "absolute",
            top: 80,
            alignSelf: "center",
            backgroundColor: "#193d58",
            paddingVertical: 15,
            paddingHorizontal: 25,
            borderRadius: 20,
            elevation: 5
          }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Trip Started
            </Text>
          </View>
        )}

        {/*Bus Card*/}
        <BusInfoCard 
          bus={selectedBus} 
          onClose={() => setSelectedBus(null)}
        />

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
  errorText: {
    color: "white", fontWeight: "bold"
  },

  busIcon: {
    width: 30, height: 30,
  },
  hintPill: {
    position: 'absolute',
    top: 30, 
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 17, 28, 0.85)', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  hintText: {
    color: '#E0F7FA',
    fontSize: 14,
    fontWeight: '600',
  },
});