import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ProductDetailScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    {/* Back button */}
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={require("./../Image/left_arrow.png")}
                            style={{ width: 25, height: 25 }}
                        />
                    </TouchableOpacity>

                </View>

            </View>
        </SafeAreaView>
    )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1, // Thêm đường line ở cuối
        borderBottomColor: '#ddd', // Màu của đường line
        backgroundColor: 'transparent', // Loại bỏ màu nền // Thêm đường line ở cuối
    },
})