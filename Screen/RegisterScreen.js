import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ToastAndroid } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { URL } from '../const/const';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const [validateUser, setValidateUser] = useState('');
    const [validatePhone, setValidatePhone] = useState('');
    const [validatePass, setValidatePass] = useState('');
    const [validaRepass, setValidateRepass] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);


    const navigation = useNavigation();

  
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('./../Image/Logo_BeeFood.png')} />
            <TextInput
                label="Tên đăng nhập"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.input}
            />
            {validateUser !== '' && <Text style={styles.errorText}>{validateUser}</Text>}
            <TextInput
                label="Số điện thoại"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                style={styles.input}
            />
            {validatePhone !== '' && <Text style={styles.errorText}>{validatePhone}</Text>}

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
            {validatePass !== '' && <Text style={styles.errorText}>{validatePass}</Text>}
            <View style={styles.passwordContainer}>
                <TextInput
                    label="Nhập lại mật khẩu"
                    value={rePassword}
                    secureTextEntry={!showRePassword}
                    onChangeText={(text) => setRePassword(text)}
                    style={styles.passwordInputField}
                />

                <Icon
                    name={showRePassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="gray"
                    onPress={() => setShowRePassword(!showRePassword)}
                    style={styles.passwordIcon}
                />
            </View>
            {validaRepass !== '' && <Text style={styles.errorText}>{validaRepass}</Text>}
            <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={styles.btn_register}
            >
                ĐĂNG KÝ
            </Button>
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
        marginBottom: 50,
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
    btn_register: {
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