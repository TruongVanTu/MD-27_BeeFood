import React from 'react';
import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from './Screen/SplashScreen';
import Home from './Screen/Home';
import { NavigationContainer } from '@react-navigation/native';
import BanhMiComponent from './Component/BanhMiComponent';
import HealthyComponent from './Component/HealthyComponent';
import AnVatComponent from './Component/AnVatComponent';
import BunPhoComponent from './Component/BunPhoComponent';
import ChickenComponent from './Component/ChickenComponent';
import DoUongComponent from './Component/DoUongComponent';
import ComxuatComponent from './Component/ComxuatComponent';
import GanbanComponent from './Component/GanbanComponent';
import SearchComponent from './Component/SearchComponent';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    
    <NavigationContainer>
     
     
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen component={SplashScreen} name='SplashScreen' />
        <Stack.Screen name='Home' component={Home} />

        <Stack.Screen component={SearchComponent} name='Search' />
        <Stack.Screen component={GanbanComponent} name='Ganban' />
        <Stack.Screen component={ComxuatComponent} name='Comxuat' />
        <Stack.Screen component={BunPhoComponent} name='BunPho' />
        <Stack.Screen component={ChickenComponent} name='Chicken' />
        <Stack.Screen component={AnVatComponent} name='AnVat' />
        <Stack.Screen component={DoUongComponent} name='DoUong' />
        <Stack.Screen component={BanhMiComponent} name='BanhMi' />
        <Stack.Screen component={HealthyComponent} name='Healthy' />
        
      </Stack.Navigator>
    

  
    </NavigationContainer>
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

// cong test
//Sang test