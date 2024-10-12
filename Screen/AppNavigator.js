import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import OrderScreen from './OrderScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
          unmountOnBlur: true,
        }}
        >
    
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" size={25} color="#319AB4" /> // Đặt màu nâu và kích thước 20
              ),
              headerShown: false, // Đặt giá trị này ở đây để ẩn tiêu đề của màn hình Home
            }}
          />
          <Tab.Screen
            name="Order"
            component={OrderScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="shopping-cart" size={25} color="#319AB4" /> // Đặt màu nâu và kích thước 20
              ),
              headerShown: false, // Đặt giá trị này ở đây để ẩn tiêu đề của màn hình Home
            }}
          />
          <Tab.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="bell" size={25} color="#319AB4" /> // Đặt màu nâu và kích thước 20
              ),
              headerShown: false, // Đặt giá trị này ở đây để ẩn tiêu đề của màn hình Home
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="user" size={25} color="#319AB4" /> // Đặt màu nâu và kích thước 20
              ),
              headerShown: false, // Đặt giá trị này ở đây để ẩn tiêu đề của màn hình Profile
            }}
          />
        
        </Tab.Navigator>
    )
}

export default AppNavigator

const styles = StyleSheet.create({})