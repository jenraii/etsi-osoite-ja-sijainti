import { useState, useEffect } from 'react';
import { StyleSheet, View, Button, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [region, setRegion] = useState({ //Haaga-Helia Campus
    latitude: 60.2,
    longitude: 24.934,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  });
  const [place, setPlace] = useState('');
  const [data, setData] = useState({
    latitude: 60.2013,
    longitude: 24.934
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({ 
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      });
      setData({ 
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();
  }, [])

  const search = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=AIzaSyAZKRMHt2nB5jbj7wh65uaa5lnT1-V_kUo&location=${place}`)
    .then(response => response.json())
    .then(data => {
      setRegion({
        latitude: data.results[0].locations[0].latLng.lat, 
        longitude: data.results[0].locations[0].latLng.lng,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      });
      setData({
        latitude: data.results[0].locations[0].latLng.lat, 
        longitude: data.results[0].locations[0].latLng.lng
      })
    })
    .catch(error => Alert.alert('Error', 'Invalid input'))
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ width: '100%', height: '75%'}}
        region={region}
      >
        <Marker
          pinColor='blue'
          coordinate={data}
        />
      </MapView>
      <TextInput style={{width: 250, height: 40, borderWidth: 1, margin: 5}} onChangeText={text => setPlace(text)} value={place} />
      <Button onPress={search} title='Search' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});