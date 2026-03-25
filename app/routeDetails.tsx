import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import UpcomingBusCard from '@/components/UpcommingBusCard';

interface BusSchedule {
  schedule_id: number;
  bus_reg_no: string;
  departure_time: string;
  arrival_time: string;
  direction: string;
}

export default function RouteDetails() {
  const router = useRouter();
  const { routeNo, routeName, base_fare, route_id } = useLocalSearchParams();
  const [busSchedule, setBusSchedule] = useState<BusSchedule[]>([]);

  const LoadBusSch = useCallback(async () => {
    try {
      // Use the actual route_id from params in the URL
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/passenger/busSchedule/${route_id}`);
      const data = await response.json();

      console.log("========== BUS DATA ==========");
      console.log(JSON.stringify(data, null, 2));
      console.log("================================");

      setBusSchedule(data);
      console.log(route_id);
    } catch (error) {
      console.log("Error Loading Bus Schedule:", error);
    }
  }, [route_id]);

  useFocusEffect(
    useCallback(() => {
      LoadBusSch();
    }, [LoadBusSch])
  );

  return (
    <LinearGradient colors={['#4475A0', '#06202E']} style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color="white" />
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>

        <View style={styles.routeMainCard}>
          <View style={styles.routeHeaderRow}>
            <View>
              <Text style={styles.title}>Route {routeNo}</Text>
              <Text style={styles.subtitle}>{routeName}</Text>
            </View>
            <Ionicons name='trail-sign' size={70} color="#3098B2" style={styles.routeIcon} />
          </View>
          <Text style={styles.fare}>Base Fare : LKR {base_fare}</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.sectionHeader}>Upcoming Buses</Text>
        <View style={styles.divider} />

        <FlatList
          data={busSchedule}
          keyExtractor={(item) => item.schedule_id.toString()}
          renderItem={({ item }) => (
            <UpcomingBusCard
              BusRegNo={item.bus_reg_no}
              departure={item.departure_time}
              arrival={item.arrival_time}
              direction={item.direction}
            />
          )}
          ListEmptyComponent={<Text style={{color: 'white', textAlign: 'center'}}>No active buses found.</Text>}
        />
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    marginLeft: 5,
    fontWeight: '600',
    color: 'white',
  },
  routeMainCard: {
    backgroundColor: '#0A1926', 
    borderRadius: 16,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  routeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 35,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#82C4BE', 
    fontWeight: '500',
  },
  routeIcon: {
    opacity: 0.8,
    marginTop: -5,
  },
  fare: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: '#44DCD0',
    marginBottom: 20,
    opacity: 0.6,
  },
  card: {
    backgroundColor: '#rgba(72, 115, 134, 1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  busPlate: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  busDetail: {
    fontSize: 15,
    color: 'white',
    marginBottom: 4,
  },
});