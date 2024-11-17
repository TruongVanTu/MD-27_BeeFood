import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RadioButton } from 'react-native-paper';
import ToolBar from './components/ToolBar';

export default function UserInfor() {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState({});
    const [selectedGender, setSelectedGender] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        getStoredUserInfo();
    }, []);

    const getStoredUserInfo = async () => {
        try {
            const storedUserInfo = await AsyncStorage.getItem('userInfo');
            if (storedUserInfo) {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
                setEditedUserInfo(parsedUserInfo);
                setSelectedGender(parsedUserInfo.gender);
            } else {
                // Nếu không có thông tin người dùng, khởi tạo đối tượng rỗng
                setUserInfo({});
                setEditedUserInfo({});
                setIsEditing(true); // Cho phép người dùng nhập thông tin
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng từ AsyncStorage:', error);
        }
    };

    const formatBirthday = (birthday) => {
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
        try {
            // Lưu thông tin người dùng vào AsyncStorage
            await AsyncStorage.setItem('userInfo', JSON.stringify(editedUserInfo));
            Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
            setIsEditing(false);
            // Cập nhật lại thông tin hiển thị
            setUserInfo(editedUserInfo);
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin:', error);
            Alert.alert('Lỗi', 'Cập nhật thất bại');
        }
    };

    const handleGenderChange = (value) => {
        setSelectedGender(value);
        setEditedUserInfo({
            ...editedUserInfo,
            gender: value,
        });
    };

    const fieldsToDisplay = [
        { key: 'username', label: 'Tên người dùng' },
        { key: 'phone', label: 'Số điện thoại' },
        {
            key: 'gender',
            label: '',
            render: () => (
                <View style={styles.genderContainer}>
                    <Text style={{ color: 'gray', fontSize: 15, marginTop: 10 }}>
                        Giới tính
                    </Text>
                    <RadioButton.Group
                        onValueChange={(value) => handleGenderChange(value)}
                        value={selectedGender}
                    >
                        <View style={styles.radioContainer}>
                            <RadioButton.Item label="Nam" value="Nam" />
                            <RadioButton.Item label="Nữ" value="Nữ" />
                        </View>
                    </RadioButton.Group>
                </View>
            ),
        },
        {
            key: 'birthday',
            label: '',
            render: () => (
                <View>
                    <Text style={{ color: 'gray', fontSize: 15, padding: 8 }}>
                        Ngày sinh
                    </Text>
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
                            {userInfo && userInfo.birthday
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
            {userInfo ? (
                <View style={styles.horizontalContainer}>
                    {/* Nếu muốn hiển thị avatar, bạn có thể bật phần này lên */}
                    {/* <View style={styles.avatarContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            {editedUserInfo.avatar ? (
                                <Image
                                    source={{ uri: editedUserInfo.avatar }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Text style={{ fontSize: 20, color: '#ff0000' }}>
                                    Chọn ảnh đại diện
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.infoContainer}>
                        {fieldsToDisplay.map((field) => (
                            <View key={field.key} style={styles.textInfo}>
                                <Text style={{ color: 'gray', fontSize: 15, marginTop: 10 }}>
                                    {field.label}
                                </Text>
                                {isEditing && field.key !== 'username' ? (
                                    field.render ? (
                                        field.render()
                                    ) : (
                                        <TextInput
                                            style={styles.text}
                                            value={editedUserInfo[field.key]}
                                            onChangeText={(text) =>
                                                setEditedUserInfo({
                                                    ...editedUserInfo,
                                                    [field.key]: text,
                                                })
                                            }
                                        />
                                    )
                                ) : (
                                    <Text style={styles.text}>
                                        {userInfo && userInfo[field.key]
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
                                <Text style={{ fontSize: 20, color: '#fff' }}>
                                    {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <Text>Đang tải thông tin...</Text>
            )}

            {isEditing && (
                <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                    <Text style={styles.buttonText}>LƯU</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontalContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 50,
    },
    avatarContainer: {
        width: '100%',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        margin: 10,
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
        padding: 10,
        backgroundColor: '#f1f8fc',
        marginBottom: 15,
        borderRadius: 20,
        borderWidth: 1,
    },
    text: {
        fontSize: 18,
    },
    button: {
        backgroundColor: '#FF9900', // Màu nền
        padding: 10,
        borderRadius: 5, // Bo góc
        margin: 10,
        alignItems: 'center',
        opacity: 0.8, // Hiệu ứng opacity
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btn: {
        backgroundColor: '#319AB4', // Màu nền xanh
        padding: 10,
        borderRadius: 5, // Bo góc
        marginTop: 10,
        alignItems: 'center',
        opacity: 0.8, // Hiệu ứng opacity
    },
    genderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
