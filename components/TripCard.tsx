import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Defining the elements that the TripCard component will receive as props
interface TripCardProps {
  id: string;
  route: string;
  path: string;
  date: string;
  time: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'; // Strict status types
}

const TripCard: React.FC<TripCardProps> = ({ id, route, path, date, time, status }) => {
  
//Status badge color logic based on trip status
  const getStatusStyle = () => {
    switch (status) {
      case 'ACTIVE': return { backgroundColor: '#E66A1F' };
      case 'COMPLETED': return { backgroundColor: '#139456' };
      case 'CANCELLED': return { backgroundColor: '#ED1C24' };
      default: return { backgroundColor: '#888' };
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.busId}>{id}</Text>
        <View style={[styles.statusBadge, getStatusStyle()]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.routeText}>Route {route}</Text>
        <Text style={styles.pathText}>{path}</Text>
        <Text style={styles.detailsText}>Date: {date}</Text>
        <Text style={styles.detailsText}>Time: {time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  busId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    gap: 2, // Spacing between text lines
  },
  routeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pathText: {
    fontSize: 14,
    color: '#444',
  },
  detailsText: {
    fontSize: 13,
    color: '#000',
  },
});

export default TripCard;