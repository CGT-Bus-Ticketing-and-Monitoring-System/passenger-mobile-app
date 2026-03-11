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
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export default function TripsScreen() {
  
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [cancelledTrips , setCancelledTrip] = useState<Trip[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadTrips = async () => {
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

        if (activeData.success) {
          setActiveTrip(activeData.data);
        }
        else {
          setActiveTrip(null);
        }

        // COMPLETED TRIPS
        const historyRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trip/history/${id}`);
        const historyData = await historyRes.json();

        if (historyData.success) {
          setCompletedTrips(historyData.data);
        }
        
        const cancleRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trip/cancel/${id}`);
        const cancleData = await cancleRes.json();

        if(cancleData.success){
          setCancelledTrip(cancleData.data);
        }

        setLoading(false);

        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      };

      loadTrips();
    }, [])
  );


  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Active Trips</Text>
        <View style={styles.divider} />
        {activeTrip && (
          <TripCard 
          id={activeTrip.registration_number}
          route={activeTrip.start_location + " → " + activeTrip.end_location}
          path={activeTrip.start_location + " to " + activeTrip.end_location}
          date={new Date(activeTrip.start_time).toLocaleDateString()}
          time={new Date(activeTrip.start_time).toLocaleTimeString()}
          status={activeTrip.status}
          />
        )}

        {!activeTrip && !loading && <Text>No active trips at the moment.</Text>}

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Recent Trip History</Text>
        <View style={styles.divider} />

        {completedTrips.map((trip, index) => (
          <TripCard
            key={index}
            id={trip.registration_number}
            route={trip.start_location + " → " + trip.end_location}
            path={trip.start_location + " to " + trip.end_location}
            date={new Date(trip.start_time).toLocaleDateString()}
            time={new Date(trip.start_time).toLocaleTimeString()}
            status={trip.status}
            />
          ))}

        {cancelledTrips.map((tripcan, index) => (
          <TripCard
            key={index}
            id={tripcan.registration_number}
            route={tripcan.start_location + " → " + tripcan.end_location}
            path={tripcan.start_location + " to " + tripcan.end_location}
            date={new Date(tripcan.start_time).toLocaleDateString()}
            time={new Date(tripcan.start_time).toLocaleTimeString()}
            status={tripcan.status}
          />

        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {backgroundColor: '#B4D8FF'},
  scrollContent: { padding: 16 },
  sectionLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  divider: { height: 2, backgroundColor: '#316FB3', marginBottom: 15 }
});