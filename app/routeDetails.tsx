import React from 'react';
import { View, Text, StyleSheet , FlatList , TouchableOpacity } from 'react-native';
import { useLocalSearchParams , useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RouteDetails() {
  const router = useRouter();
  const { routeNo, routeName } = useLocalSearchParams();

  const buses = [
    {id : '1' , plate: 'kv145', model: 'toyota' , passengers : 25},
    {id : '2' , plate: 'kv165', model: 'toyota' , passengers : 55},
    {id : '3' , plate: 'kv155', model: 'toyota' , passengers : 75},
  ];

  const renderBusCard = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.busPlate}>{item.plate}</Text>
      <Text style={styles.busDetail}><Text style={{fontWeight: 'bold'}}>Model :</Text>{item.model}</Text>
      <Text style={styles.busDetail}>{item.passengers}</Text>
      <Text>{item.plate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.whiteSection}>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color="black" />
          <Text>Go Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Route {routeNo}</Text>
        <Text style={styles.subtitle}>{routeName}</Text>
        <Text style={styles.fare}>Base Fare: LKR 200.00</Text>

      </View>

      <View style={styles.blueSection}>
        <Text style={styles.sectionHeader}>Active Buses In The Selected Route</Text>
        <View style={styles.divider} />

        <FlatList        
          data={buses}
          keyExtractor={(item) => item.id}
          renderItem = {renderBusCard}
          contentContainerStyle={{paddingBottom : 20}}
          showsVerticalScrollIndicator={false}
        />
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  whiteSection: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    marginLeft: 5,
    fontWeight: '500',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 24,
    color: '#444',
    marginBottom: 30,
  },
  fare: {
    fontSize: 32,
    fontWeight: '500',
  },
  blueSection: {
    flex: 1,
    backgroundColor: '#B4D8FF',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  divider: {
    height: 2,
    backgroundColor: '#004AAD',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  busPlate: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  busDetail: {
    fontSize: 18,
    color: '#000',
    marginTop: 2,
  },
});