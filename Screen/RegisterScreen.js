import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ToastAndroid } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { URL } from '../const/const';
import Toast from 'react-native-toast-message';

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

    const handleRegister = async () => {

        const trimmedUsername = username.trim();
        const trimmedPhone = phone.trim();
        const trimmedPassword = password.trim();
        const trimmedRepassword = rePassword.trim();


        if (trimmedUsername == "") {
            setValidateUser('Vui lòng không được bỏ trống!!');
            return;
        } else {
            setValidateUser('');
        }

        if (trimmedUsername.length < 3) {
            setValidateUser('Tên đăng nhập không hợp lệ');
            return;
        } else {
            setValidateUser('');
        }

        if (trimmedPhone == "") {
            setValidatePhone('Số điện thoại không được để trống');
            return;
        } else {
            setValidatePhone('');
        }
        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            setValidatePhone('Số điện thoại không hợp lệ');
            return;
        } else {
            setValidatePhone('');
        }

        //mật khẩu
        if (trimmedPassword == "") {
            setValidatePass('Mật khẩu không được để trống!');
            return;
        } else {
            setValidatePass('');
        }
        if (trimmedPassword.length < 2) {
            setValidatePass('Mật khẩu không hợp lệ!');
            return;
        } else {
            setValidatePass('');
        }

        //xác nhận mật khẩu
        if (rePassword == "") {
            setValidateRepass('Bạn chưa xác nhận mật khẩu');
            return;
        } else {
            setValidateRepass('');
        }
        if (rePassword !== trimmedPassword) {
            setValidateRepass('Mật khẩu nhập lại không khớp');
            return;
        } else {
            setValidateRepass('');
        }


        // Tạo dữ liệu
        const registrationData = {
            "username": trimmedUsername,
            "phone": trimmedPhone,
            "password": trimmedPassword,
            "rePassword": trimmedRepassword
        };

        // Gửi yêu cầu POST
        await fetch(URL + 'api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        })

            .then(res => {
                if (res.status === 200) {
                    // Hiển thị thông báo thành công khi đăng ký
                    Toast.show({
                        type: 'success', // kiểu thông báo: success, error, info
                        position: 'top', // vị trí thông báo: top, bottom
                        text1: 'Đăng ký thành công', // Tiêu đề của thông báo
                        visibilityTime: 3000, // Thời gian hiển thị thông báo (mili giây)
                        autoHide: true, // Tự động ẩn thông báo sau thời gian `visibilityTime`
                        topOffset: 50, // Khoảng cách từ trên xuống (dành cho iOS)
                    });
                    setUsername("");
                    setPhone("");
                    setPassword("");
                    navigation.navigate('Login');
                } else if (res.status === 501) {
                    Toast.show({
                        type: 'error',  // Loại thông báo là lỗi (error)
                        position: 'top',  // Hiển thị ở trên cùng màn hình
                        text1: 'Tên tài khoản đã được sử dụng',  // Tiêu đề thông báo
                        text2: 'Vui lòng chọn một tên tài khoản khác.',  // Nội dung chi tiết
                        visibilityTime: 3000,  // Thời gian hiển thị thông báo (3000ms = 3 giây)
                        autoHide: true,  // Tự động ẩn sau thời gian `visibilityTime`
                        topOffset: 50,  // Khoảng cách từ trên xuống (cho iOS)
                    });
                } else if (res.status === 502) {
                    Toast.show({
                        type: 'error',  // Loại thông báo là lỗi (error)
                        position: 'top',  // Hiển thị ở trên cùng màn hình
                        text1: 'Số điện thoại đã được sử dụngdụng',  // Tiêu đề thông báo
                        text2: 'Vui lòng chọn một số điện thoại khác.',  // Nội dung chi tiết
                        visibilityTime: 3000,  // Thời gian hiển thị thông báo (3000ms = 3 giây)
                        autoHide: true,  // Tự động ẩn sau thời gian `visibilityTime`
                        topOffset: 50,  // Khoảng cách từ trên xuống (cho iOS)
                    });
                } else {
                    Toast.show({
                        type: 'error',  // Loại thông báo là lỗi (error)
                        position: 'top',  // Hiển thị ở trêntrên cùng màn hình
                        text1: 'Đăng ký thất bạibại',  // Tiêu đề thông báo
                        visibilityTime: 3000,  // Thời gian hiển thị thông báo (3000ms = 3 giây)
                        autoHide: true,  // Tự động ẩn sau thời gian `visibilityTime`
                        topOffset: 50,  // Khoảng cách từ trên xuống (cho iOS)
                    });
                }
            })
            .catch(e => {
                console.error(e);
                Toast.show({
                    type: 'error',  // Loại thông báo là lỗi (error)
                    position: 'top',  // Hiển thị ở trêntrên cùng màn hình
                    text1: 'Đăng ký thất bạibại',  // Tiêu đề thông báo
                    visibilityTime: 3000,  // Thời gian hiển thị thông báo (3000ms = 3 giây)
                    autoHide: true,  // Tự động ẩn sau thời gian `visibilityTime`
                    topOffset: 50,  // Khoảng cách từ trên xuống (cho iOS)
                });
            });

    }

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('./../Image/Logo_BeeFood.png')} />
            <TextInput
                label="Tên đăng nhập"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.input}
                theme={{ colors: { primary: '#319AB4' } }}
            />
            {validateUser !== '' && <Text style={styles.errorText}>{validateUser}</Text>}
            <TextInput
                label="Số điện thoại"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                style={styles.input}
                theme={{ colors: { primary: '#319AB4' } }}
            />
            {validatePhone !== '' && <Text style={styles.errorText}>{validatePhone}</Text>}

            <View style={styles.passwordContainer}>
                <TextInput
                    label="Mật khẩu"
                    value={password}
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.passwordInputField}
                    theme={{ colors: { primary: '#319AB4' } }}
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
                    theme={{ colors: { primary: '#319AB4' } }}
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
                onPress={handleRegister}
                style={styles.btn_register}
            >
                ĐĂNG KÝ
            </Button>
            <Text style={styles.backText} >
                Đã có tài khoản? <Text style={styles.backLink} onPress={() => navigation.navigate('Login')}>Quay lại đăng nhập</Text>
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
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
        borderRadius: 5,
    },
    passwordContainer: {
        width: '80%',
        marginBottom: 20,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInputField: {
        flex: 1,
        backgroundColor: 'lightblue',
        borderRadius: 5,
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
    backText: {
        marginTop: 20,
        fontSize: 15,
        color: '#777',
        textAlign: 'center',
    },
    backLink: {
        color: '#319AB4', // Màu nhấn mạnh
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },

});