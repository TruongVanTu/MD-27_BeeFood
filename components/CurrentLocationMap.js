import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const CurrentLocationMap = ({ address }) => {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        // Get user's current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Use Location.geocodeAsync to convert address to coordinates
        const locationResults = await Location.geocodeAsync(address);
        
        if (locationResults.length > 0) {
          const { latitude, longitude } = locationResults[0];
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
          };
          
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 5000);
        } else {
          // Fallback to user's location if geocoding fails
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.006,
            longitudeDelta: 0.006,
          };
          setRegion(newRegion); 
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [address]);

  if (!region) {
    return (
      <View style={styles.mapPlaceholder}>
        <Text>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        onMapReady={() => setMapLoaded(true)}
      >
        {mapLoaded}
        {mapLoaded && <Marker coordinate={region} pinColor="red" title="Địa chỉ" />}
        {mapLoaded && userLocation && (
          <Marker 
            coordinate={userLocation} 
            pinColor="blue" 
            title="Vị trí của bạn"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 3,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    height: Dimensions.get('window').height / 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CurrentLocationMap;

