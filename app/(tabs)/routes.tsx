import { View, Text, StyleSheet, TextInput} from 'react-native';
import RouteCard from '@/components/RouteCard';

export default function RoutesScreen() {
  return (
    <View style={styles.container}>
      <TextInput placeholder='Search For Routes...'placeholderTextColor='#727272' style={styles.search}>
      </TextInput>

      <View style={styles.header}>
        <Text style={styles.title}>Matching Routes</Text>
        <View style={styles.divider}></View>
      </View>

      <RouteCard RouteNo="244" route="Negombo → Gampaha" />
      <RouteCard RouteNo="240" route="Negombo → Colombo" />
      <RouteCard RouteNo="120" route="Colombo to Homagama" />

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