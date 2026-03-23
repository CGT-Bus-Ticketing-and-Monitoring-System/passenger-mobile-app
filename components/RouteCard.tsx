import React from 'react';
import { View, Text, StyleSheet , TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


interface TripCardProps {
  RouteNo: string;
  route: string;
  base_fare: number;
  route_id : number;
}

const RouteCard: React.FC<TripCardProps> = ({ RouteNo, route , base_fare, route_id}) => {

  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/routeDetails",
      params: {
        routeNo: RouteNo,
        routeName: route,
        base_fare: base_fare,
        route_id : route_id,
      }
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <Text style={styles.busId}>Route {RouteNo}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.routeText}>{route}</Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  card: {
    backgroundColor: 'rgba(182, 249, 255, 0.29)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    marginBottom: 15,
  },

  cardHeader: {
    marginBottom: 4,
  },

  busId: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },

  infoSection: {
    marginTop: 2,
  },

  routeText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#E0F7FA',
  },

});

export default RouteCard;