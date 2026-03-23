import { View, Text, StyleSheet, TextInput , ScrollView} from 'react-native';
import RouteCard from '@/components/RouteCard';
import { useCallback, useEffect , useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Route{
  route_code : string;
  start_location : string;
  end_location : string;
  base_fare : number;
  route_id : number;
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
    <LinearGradient colors={['#4475A0', '#06202E']} style={styles.container}>
      <TextInput placeholder='Search For Routes...'placeholderTextColor='#727272' style={styles.search}>
      </TextInput>

      <View style={styles.header}>
        <Text style={styles.title}>Matching Routes</Text>
        <View style={styles.divider}></View>
      </View>

      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContent}>

        {activeRoute.map((trip, index) => (
          <RouteCard
            key={index}
            RouteNo={trip.route_code}
            route={`${trip.start_location} to ${trip.end_location}`}
            base_fare={trip.base_fare}
            route_id={trip.route_id}
          />
        ))}

      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  search: {
    backgroundColor: '#FFFFFF',
    color: '#000',
    padding: 18,
    fontSize: 16,
    borderRadius: 15,
    marginBottom: 25,
  },

  header: {
    marginBottom: 5,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },

  divider: {
    height: 2,
    backgroundColor: '#44DCD0',
    marginBottom: 20,
  },

});