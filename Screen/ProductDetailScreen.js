import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ProductDetailScreen = ({ navigation, route }) => {
    const { product , type} = route.params;
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
                    {/* Title */}
                    <Text style={{ fontWeight: "bold", flex: 1, fontSize: 24 }}>
                        {" "}
                        Chi tiết sản phẩm{" "}
                    </Text>

                    {/* Cart button */}
                    <TouchableOpacity style={styles.menuButton}>
                        <Image
                            source={require("./../Image/menu-icon.png")}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <Image source={require('../Image/banner.jpg')} style={styles.image} />
                    {/* Product name and price */}
                    <View style={styles.contentRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.productName}>Bún chó</Text>
                        </View>
                        <View>
                            <Text style={styles.productPrice}>30.000 VND</Text>
                        </View>
                        {/* Product description */}
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}>jhsad</Text>
                        </View>
                    </View>
                </ScrollView>

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
    scrollView: { margin: 10 },
    image: {
        width: '97%',
        borderRadius: 10,
        height: 200,
        marginBottom: 10,
        margin: 5
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    productName: {
        padding: 8,
        fontSize: 20,
        fontWeight: 'bold',
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 8
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    descriptionContainer: {
        padding: 8, alignItems: 'center',
        flexDirection: 'row'
    },
    description: {
        marginLeft: 10,
        fontSize: 16,
    },
})