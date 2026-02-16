import React from 'react';
import { ScrollView, Text, StyleSheet, View} from 'react-native';
import TripCard from '../../components/TripCard'; 
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TripsScreen() {
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Active Trips</Text>
        <View style={styles.divider} />
        <TripCard 
          id="KV 1415"
          route="240"
          path="Negombo to Colombo"
          date="22/02/2026"
          time="08:45 -"
          status="Active"
        />

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Recent Trip History</Text>
        <View style={styles.divider} />
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