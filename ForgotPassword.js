import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { URL } from './const/const';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedUsername || !trimmedPhone) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên đăng nhập và số điện thoại');
      return;
    }

    try {
      const response = await fetch(`${URL}api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, phone: trimmedPhone })
      });

      const data = await response.json();
      if (response.status === 200) {
        Alert.alert('Thông báo', 'Mật khẩu đã được đặt lại thành "1". Vui lòng đăng nhập lại.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Lỗi', data.error || 'Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kết nối tới server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.description}>Nhập tên đăng nhập và số điện thoại. Nếu đúng, mật khẩu sẽ đặt lại thành "1".</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập tên đăng nhập"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
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
  description: {
    fontSize:16,
    textAlign:'center',
    marginBottom:20
  },
  input:{
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    marginBottom:10,
    borderRadius:5
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
