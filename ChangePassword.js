import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from './const/const';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Thêm Icon nếu muốn

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // State để quản lý hiển thị mật khẩu
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const navigation = useNavigation();

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            return Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('_id');

            const response = await fetch(URL + `api/users/update/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    password: newPassword
                }),
            });

            const responseData = await response.json();

            if (response.status === 200) {
                Alert.alert('Thông báo', 'Đổi mật khẩu thành công');
                navigation.goBack();
            } else {
                Alert.alert('Lỗi', responseData.error || 'Đổi mật khẩu thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đổi mật khẩu.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đổi mật khẩu</Text>

            {/* Mật khẩu cũ */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu cũ"
                    secureTextEntry={!showCurrentPassword}
                    onChangeText={setCurrentPassword}
                    value={currentPassword}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Icon
                        name={showCurrentPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color="gray"
                        style={{ paddingHorizontal: 10 }}
                    />
                </TouchableOpacity>
            </View>

            {/* Mật khẩu mới */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu mới"
                    secureTextEntry={!showNewPassword}
                    onChangeText={setNewPassword}
                    value={newPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Icon
                        name={showNewPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color="gray"
                        style={{ paddingHorizontal: 10 }}
                    />
                </TouchableOpacity>
            </View>

            {/* Xác nhận mật khẩu mới */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu mới"
                    secureTextEntry={!showConfirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    value={confirmNewPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                    <Icon
                        name={showConfirmNewPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color="gray"
                        style={{ paddingHorizontal: 10 }}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding:20,
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    title: {
        fontSize:24,
        fontWeight:'bold',
        marginBottom:20,
        textAlign:'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:5,
        marginBottom:10,
        backgroundColor:'#f9f9f9',
    },
    input:{
        flex:1,
        padding:10,
    },
    button:{
        backgroundColor:'#319AB4',
        padding:15,
        borderRadius:5,
        alignItems:'center',
        marginTop:10
    },
    buttonText:{
        color:'#fff',
        fontWeight:'bold',
        fontSize:16
    }
});
