import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


interface TripCardProps {
  RouteNo: string;
  route: string;
}

const RouteCard: React.FC<TripCardProps> = ({ RouteNo, route}) => {
  return (
    <View style={styles.card}>

      <View style={styles.cardHeader}>
        <Text style={styles.busId}>Route {RouteNo}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.routeText}>{route}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,

    elevation: 3,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  cardHeader: {
    marginBottom: 6,
  },

  busId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  infoSection: {
    marginTop: 2,
  },

  routeText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#333',
  },

});

export default RouteCard;