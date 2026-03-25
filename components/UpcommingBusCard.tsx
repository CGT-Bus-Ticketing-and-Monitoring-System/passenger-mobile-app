import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BusScheduleProps {
  BusRegNo : string;
  departure: string;
  arrival: string;
  direction: string;
}

const UpcomingBusCard: React.FC<BusScheduleProps> = ({ BusRegNo, departure, arrival, direction }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.busPlate}>Bus Num: {BusRegNo}</Text>
        <View style={[styles.badge, direction === 'RETURN' ? styles.returnBadge : styles.forwardBadge]}>
          <Text style={styles.badgeText}>{direction}</Text>
        </View>
      </View>

      <View style={styles.timeSection}>
        <View style={styles.timeBlock}>
          <Ionicons name="time-outline" size={16} color="#82C4BE" />
          <Text style={styles.busDetail}> Departs: <Text style={styles.whiteText}>{departure}</Text></Text>
        </View>
        
        <View style={styles.timeBlock}>
          <Ionicons name="flag-outline" size={16} color="#82C4BE" />
          <Text style={styles.busDetail}> Arrives: <Text style={styles.whiteText}>{arrival}</Text></Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(72, 115, 134, 0.4)', // Matches your design's translucent blue
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  busPlate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  forwardBadge: { backgroundColor: '#44DCD0' },
  returnBadge: { backgroundColor: '#FF8C00' },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#06202E',
  },
  timeSection: {
    gap: 8,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busDetail: {
    fontSize: 15,
    color: '#82C4BE',
    marginLeft: 5,
  },
  whiteText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default UpcomingBusCard;