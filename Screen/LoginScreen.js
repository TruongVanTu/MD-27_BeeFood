import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, BackHandler, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { URL } from '../const/const';
import Toast from 'react-native-toast-message';



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


      const handleLogin = () => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        console.log(trimmedUsername);

        if (username === '' || password === '') {
            Toast.show({
                type: 'error',
                text1: 'Tên đăng nhập và mật khẩu không được để trống',
              });
            return; // Ngừng xử lý
        }

        const loginData = {
            "username":trimmedUsername,
            "password":trimmedPassword,
        };
        // Gửi yêu cầu POST

        fetch(URL+'api/users/login', {


            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
        .then(async (res) => {
            const data = await res.json();  // Parse dữ liệu trả về từ máy chủ
            // console.log("data user ",data);
            // console.log("data chuan ",data.data._ia);
    
            if (res.status === 200) {
                // Đăng nhập thành công
                
                 // Lưu trạng thái isLoggedIn vào AsyncStorage
                await AsyncStorage.setItem('username', data.data.username);
                await AsyncStorage.setItem('isLogin', 'true');
                console.log("data user ",data);
                // Lưu _id của người dùng vào AsyncStorage nếu _id tồn tại trong dữ liệu trả về
                if (data.data._id) {
                    await AsyncStorage.setItem('_id', data.data._id);
                    setIsLoggedIn(true); // <-- Cập nhật trạng thái isLoggedIn
                    await AsyncStorage.setItem('isLoggedIn', 'true');
                }
    
                navigation.navigate('Appnavigator');
            } else if (res.status === 401) {
                // Đăng nhập thất bại
                Toast.show({
                    type: 'error',
                    text1: 'Tên đăng nhập hoặc mật khẩu không đúng',
                  });
            }
        })
        .catch((e) => {
            console.error(e);
            Toast.show({
                type: 'error',
                text1: 'Lỗi kết nối',
              });
        });
    };


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
            <Button mode="contained" onPress={() => handleLogin()} style={styles.btn_login}>
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
        backgroundColor: '#f9f9f9', // Màu nền tổng thể
        paddingHorizontal: 20,
    },
    logo: {
        width: 180,
        height: 120,
        marginBottom: 40,
    },
    input: {
        width: '100%',
        height: 50,
        marginBottom: 20,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: 'lightblue',
        elevation: 2, // Tạo hiệu ứng nổi
    },
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'lightblue',
        borderRadius: 8,
        elevation: 2,
        marginBottom: 20,
    },
    passwordInputField: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    passwordIcon: {
        marginRight: 15,
    },
    btn_login: {
        width: '100%',
        height: 50,
        backgroundColor: '#319AB4',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },
    btn_login_text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerText: {
        marginTop: 20,
        fontSize: 15,
        textAlign: 'center',
        color: '#777',
    },
    registerLink: {
        color: '#319AB4',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
