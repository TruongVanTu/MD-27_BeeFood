import React, { useState,useEffect  } from 'react';
import { View, Text, StyleSheet, Image, BackHandler } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from "@react-navigation/native";
import { URL } from '../const/const';



export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLoginPressed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigation = useNavigation();
    
    useEffect(() => {
        const backAction = () => {
          console.log('back');
          navigation.replace('Appnavigator')
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
      }, []);
    

   
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('./../Image/Logo_BeeFood.png')} />
            <TextInput
                label="Tên đăng nhập"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.input}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    label="Mật khẩu"
                    value={password}
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.passwordInputField}
                />
                <Icon
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="gray"
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.passwordIcon}
                />
            </View>
            <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.btn_login}>
                ĐĂNG NHẬP
            </Button>
            <Text style={styles.registerText}>
                Chưa có tài khoản?{' '}
                <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                    Đăng ký ngay
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 100,
        marginBottom: 80,
    },
    input: {
        width: '80%',
        marginBottom: 20,
        backgroundColor: 'lightblue',
    },
    passwordContainer: {
        width: '80%',
        marginBottom: 20,
        position: 'relative',
        flexDirection: 'row', // Đặt trong một dòng
        alignItems: 'center', // Căn giữa theo chiều dọc
    },
    passwordInputField: {

        flex: 1, // Để TextInput mở rộng để điền dữ liệu
        backgroundColor: 'lightblue',
    },
    passwordIcon: {
        position: 'absolute',
        right: 10,
    },
    btn_login: {
        width: '80%',
        marginTop: 30,
        backgroundColor: '#319AB4',
        borderRadius: 10,
    },
    registerText: {
        marginTop: 20,
        fontSize: 15,
    },
    registerLink: {
        color: 'blue',
    },
});