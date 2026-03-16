import { View, Text, StyleSheet, TextInput , ScrollView} from 'react-native';
import RouteCard from '@/components/RouteCard';
import { useCallback, useEffect , useState } from 'react';
import { useFocusEffect } from 'expo-router';

interface Route{
  route_code : string;
  start_location : string;
  end_location : string;
}

export default function RoutesScreen() {

  const [activeRoute, setActiveRoute] = useState<Route[]>([]);

  const LoadRoute = useCallback(async () => {
    try{
      const  getrouteRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/passenger/busRoutes`);
      const data = await getrouteRes.json();

      setActiveRoute(data);
      
    }catch (error) {
      console.log("Error Loading the Routes... this is a custom exeption from the routes.tsx" , error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      LoadRoute();
    }, [LoadRoute])

  );


  return (
    <View style={styles.container}>
      <TextInput placeholder='Search For Routes...'placeholderTextColor='#727272' style={styles.search}>
      </TextInput>

      <View style={styles.header}>
        <Text style={styles.title}>Matching Routes</Text>
        <View style={styles.divider}></View>
      </View>

      <ScrollView nestedScrollEnabled>

        {activeRoute.map((trip, index) => (
          <RouteCard
            key={index}
            RouteNo={trip.route_code}
            route={`${trip.start_location}  to  ${trip.end_location}`}
          />
        ))}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    backgroundColor : '#B4D8FF'
  },

  search: {
    backgroundColor: '#FFFFFF',
    color: '#727272',
    padding: 18,
    fontSize: 16,
    borderRadius: 20,
    marginBottom: 20,
  },

  header: {
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  divider: {
    height: 2,
    backgroundColor: '#316FB3',
    marginBottom: 15,
  },

});