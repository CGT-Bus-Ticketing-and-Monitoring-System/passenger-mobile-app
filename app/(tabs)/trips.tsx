import React from 'react';
import { ScrollView, Text, StyleSheet, View} from 'react-native';
import TripCard from '../../components/TripCard'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

interface Trip {
  registration_number: string;
  start_location: string;
  end_location: string;
  start_time: string;
  route_code: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export default function TripsScreen() {
  
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [cancelledTrips , setCancelledTrip] = useState<Trip[]>([]);

  const loadTrips = useCallback(async () => {
    try {
      const userdata = await AsyncStorage.getItem("userData");

      let id = null; 

      if(userdata) {
        const user = JSON.parse(userdata);
        id = user.id;
        setUserId(id);
      }

      if (!id) {
        setLoading(false);
        return;
      }

      // ACTIVE TRIP
      const activeRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trip/active/${id}`);
      const activeData = await activeRes.json();

      if (activeData.length > 0) {
        setActiveTrip(activeData[0]);
      }
      else {
        setActiveTrip(null);
      }

      // COMPLETED TRIPS
      const historyRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trip/history/${id}`);
      const historyData = await historyRes.json(); 
      setCompletedTrips(historyData);
      
      const cancleRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trip/cancel/${id}`);
      const cancleData = await cancleRes.json();
      setCancelledTrip(cancleData);

      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [loadTrips])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      loadTrips();
    }, 3000);

    return () => clearInterval(interval);
  }, [loadTrips]);

  const MAX_VISIBLE_TRIPS = 3;

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Active Trips</Text>
        <View style={styles.divider} />
        {activeTrip && (
          <TripCard 
          id={activeTrip.registration_number}
          route={activeTrip.route_code}
          path={activeTrip.start_location + " to " + activeTrip.end_location}
          date={new Date(activeTrip.start_time).toLocaleDateString()}
          time={new Date(activeTrip.start_time).toLocaleTimeString()}
          status={activeTrip.status}
          />
        )}

        {!activeTrip && !loading && <Text>No active trips at the moment.</Text>}

        <Text style={[styles.sectionLabel, { marginTop: 23 }]}>Recent Trip History</Text>
        <View style={styles.divider} />


        <View style={{maxHeight: completedTrips.length > MAX_VISIBLE_TRIPS ? 300 : undefined , marginTop : 10}}>
          <ScrollView nestedScrollEnabled>
            {completedTrips.map((trip, index) => (
              <TripCard
                key={index}
                id={trip.registration_number}
                route={trip.route_code}
                path={trip.start_location + " to " + trip.end_location}
                date={new Date(trip.start_time).toLocaleDateString()}
                time={new Date(trip.start_time).toLocaleTimeString()}
                status={trip.status}
                />
              ))}
          </ScrollView>
        </View>

        <View style={{marginTop : 30 , marginBottom : 10}}>
          {cancelledTrips.map((tripcan, index) => (
            <TripCard
              key={index}
              id={tripcan.registration_number}
              route={tripcan.route_code}
              path={tripcan.start_location + " to " + tripcan.end_location}
              date={new Date(tripcan.start_time).toLocaleDateString()}
              time={new Date(tripcan.start_time).toLocaleTimeString()}
              status={tripcan.status}
            />

          ))}
        </View>



      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {backgroundColor: '#B4D8FF', flex: 1 },
  scrollContent: { padding: 16 },
  sectionLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  divider: { height: 2, backgroundColor: '#316FB3', marginBottom: 15 }
});