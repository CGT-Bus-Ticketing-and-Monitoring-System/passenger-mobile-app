import React from 'react';
import { ScrollView, Text, StyleSheet, View} from 'react-native';
import TripCard from '../../components/TripCard'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';




export default function TripsScreen() {
  
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {

  fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/trip/active/1`)
    // This is a temp variable need help to get the Token userid (like from the session man)
    .then(response => response.json())
    .then(data => {

      if (data.success) {
        setActiveTrip(data.data);
      }

      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    });

  }, []);


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
        {/* These are not dynamic i will fix the quick */}
        <TripCard id="KV 1415" route="240" path="Negombo to Colombo" date="22/02/2026" time="08:45 - 09:35" status="Completed" />
        <TripCard id="KV 1415" route="240" path="Negombo to Colombo" date="22/02/2026" time="N/A" status="Cancelled" />
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