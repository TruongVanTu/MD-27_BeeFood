import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SearchScreen from './Component/SearchScreen';
import Home from './Screen/Home';
import AnVatComponent from './Component/AnVatComponent';
import GanbanComponent from './Component/GanbanComponent';
import ComxuatComponent from './Component/ComxuatComponent';
import BunPhoComponent from './Component/BunPhoComponent';
import ChickenComponent from './Component/ChickenComponent';
import DoUongComponent from './Component/DoUongComponent';
import BanhMiComponent from './Component/BanhMiComponent';
import AllProducts from './Screen/AllProducts';
import AllRestaurnat from './Screen/AllRestaurnat';
import RestaurantScreen from './Screen/RestaurantScreen';
import ProductDetailScreen from './Screen/ProductDetailScreen';
import AppNavigator from './Screen/AppNavigator';
import OrderScreen from './Screen/OrderScreen';
import NotificationScreen from './Screen/NotificationScreen';
import ProfileScreen from './Screen/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Appnavigator' component={AppNavigator} />
        <Stack.Screen name='Home' component={Home} />

        <Stack.Screen component={GanbanComponent} name='Ganban' />
        <Stack.Screen component={ComxuatComponent} name='Comxuat' />
        <Stack.Screen component={BunPhoComponent} name='BunPho' />
        <Stack.Screen component={ChickenComponent} name='Chicken' />
        <Stack.Screen component={AnVatComponent} name='AnVat' />
        <Stack.Screen component={DoUongComponent} name='DoUong' />
        <Stack.Screen component={BanhMiComponent} name='BanhMi' />
        <Stack.Screen component={OrderScreen} name='Order' />
        <Stack.Screen component={NotificationScreen} name='Notifications' />
        <Stack.Screen component={ProfileScreen} name='Profile' />

        <Stack.Screen component={ProductDetailScreen} name='ProductDetail' options={{ title: 'Chi tiết sản phẩm' }} />

        <Stack.Screen component={AllProducts} name='AllProducts' />

        <Stack.Screen component={RestaurantScreen} name='Restaurant' screenOptions={{
          unmountOnBlur: true,
        }} />

        <Stack.Screen component={AllRestaurnat} name='AllRestaurant' />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

// cong test
//Sang test