import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const ToolBar = ({ title, onBackPress }) => {
    return (
        <View style={styles.toolbar}>
            <TouchableOpacity onPress={onBackPress}>
                <Image source={require('../Image/left_arrow.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    toolbar: {
        height: 60,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1, // Thêm đường line ở cuối
        borderBottomColor: '#ddd', // Màu của đường line
        backgroundColor: 'transparent', // Loại bỏ màu nền
    },
    backIcon: {
        width: 25,
        height: 25,
        marginRight: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export default ToolBar;
