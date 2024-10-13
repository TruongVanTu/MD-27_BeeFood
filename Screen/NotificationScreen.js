import { Image, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HistoryScreen from './HistoryScreen'

const NotificationScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("./../Image/Logo_BeeFood.png")} // Thay đổi đường dẫn ảnh
                    style={styles.logo}
                />
                <Text style={styles.title}>Notification Food</Text>
            </View>
            <HistoryScreen />

        </SafeAreaView>
    )
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 25 : 0, // Điều này sẽ giữ khoảng cách 15px trên Android, không có gì trên iOS
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1, // Thêm đường viền dưới cùng của header
        borderBottomColor: "#ccc", // Màu đường viền
    },
    logo: {
        width: 70,
        height: 50,
        marginRight: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
})