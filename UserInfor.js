import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ToolBar from './components/ToolBar';

import { URL } from './const/const';

export default function UserInfor() {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState({});
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        getStoredUserId();
    }, []);

    const getStoredUserId = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUserId = await AsyncStorage.getItem('_id');
            setToken(storedToken);
            setUserId(storedUserId);

            if (storedUserId) {
                fetchUserInfo(storedUserId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy ID người dùng từ AsyncStorage:', error);
        }
    };

    const fetchUserInfo = async (user_Id) => {
        try {
            const response = await fetch(URL + `api/users/info/${user_Id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const userData = await response.json();
                setUserInfo(userData);
                setEditedUserInfo(userData);
            } else {
                console.error('Lỗi khi lấy thông tin người dùng từ máy chủ.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
    };

    const formatBirthday = (birthday) => {
        if (!birthday) return '';
        const date = new Date(birthday);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        setEditedUserInfo({
            ...editedUserInfo,
            birthday: date,
        });
    };

    const handleSaveChanges = async () => {
        const updateData = {
            username: editedUserInfo.username,
            phone: editedUserInfo.phone,
            gender: editedUserInfo.gender,
            birthday: editedUserInfo.birthday,
        };

        try {
            const response = await fetch(URL + `api/users/update/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const responseData = await response.json();

            if (response.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
                setIsEditing(false);
                fetchUserInfo(userId); // Làm mới thông tin
            } else {
                Alert.alert('Lỗi', responseData.error || 'Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin.');
        }
    };

    const fieldsToDisplay = [
        {
            key: 'username',
            label: 'Tên người dùng',
            render: () =>
                (
                    <Text style={styles.text}>{userInfo.username}</Text>
                ),
        },
        {
            key: 'phone',
            label: 'Số điện thoại',
            render: () =>
                isEditing ? (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nhập số điện thoại"
                        onChangeText={(text) =>
                            setEditedUserInfo({ ...editedUserInfo, phone: text })
                        }
                        value={editedUserInfo.phone || ''}
                    />
                ) : (
                    <Text style={styles.text}>{userInfo.phone}</Text>
                ),
        },
        {
            key: 'birthday',
            label: 'Ngày sinh',
            render: () => (
                <View>
                    {isEditing ? (
                        <TouchableOpacity onPress={showDatePicker}>
                            <Text style={styles.text}>
                                {editedUserInfo.birthday
                                    ? formatBirthday(editedUserInfo.birthday)
                                    : 'Chọn ngày'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.text}>
                            {userInfo.birthday
                                ? formatBirthday(userInfo.birthday)
                                : ''}
                        </Text>
                    )}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
            ),
        },
    ];

    return (
        <View style={styles.container}>
            <ToolBar title="Thông tin cá nhân" onBackPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {userInfo ? (
                    <View style={styles.horizontalContainer}>
                        <View style={styles.infoContainer}>
                            {fieldsToDisplay.map((field) => (
                                <View key={field.key} style={styles.textInfo}>
                                    <Text style={{ color: 'gray', fontSize: 15, marginTop: 10}}>
                                        {field.label}
                                    </Text>
                                    {isEditing ? (
                                        field.render && field.render()
                                    ) : (
                                        <Text style={styles.text}>
                                            {field.render
                                                ? field.render()
                                                : userInfo && userInfo[field.key]
                                                    ? userInfo[field.key]
                                                    : ''}
                                        </Text>
                                    )}
                                </View>
                            ))}
                            <View>
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => setIsEditing(!isEditing)}
                                >
                                    <Text style={{ fontSize: 20, color: '#ff0000' }}>
                                        {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                            {/* Thêm nút đổi mật khẩu */}
                            <View style={{marginTop:20}}>
                                <TouchableOpacity
                                    style={styles.changePassBtn}
                                    onPress={() => navigation.navigate('ChangePassword')} 
                                >
                                    <Text style={{ fontSize: 20, color: '#fff' }}>Đổi mật khẩu</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                ) : (
                    <Text>Vui lòng đăng nhập</Text>
                )}

                {isEditing && (
                    <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                        <Text style={styles.buttonText}>LƯU</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:30
    },
    horizontalContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 50,
    },
    infoContainer: {
        marginTop: 30,
        margin: 20,
        padding: 10,
        width: '100%',
    },
    textInfo: {
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
        padding:10,
        backgroundColor: '#f1f8fc',
        marginBottom:15,
        borderRadius:20,
        borderWidth:1
    },
    text: {
        fontSize: 18,
    },
    button: {
        backgroundColor: '#FF9900', 
        padding: 10,
        borderRadius: 5, 
        margin: 10,
        alignItems: 'center',
        opacity: 0.8, 
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btn: {
        backgroundColor: '#319AB4', 
        padding: 10,
        borderRadius: 5, 
        marginTop: 10,
        alignItems: 'center',
        opacity: 0.8, 
    },
    changePassBtn: {
        backgroundColor: '#DD3333',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        opacity: 0.8,
    },
    textInput: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 8,
        color: 'black',
    },
});
