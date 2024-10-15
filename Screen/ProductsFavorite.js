import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, FlatList, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('window')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ToolBar from './../components/ToolBar';
import { URL } from '../const/const';

const ProductsFavorite = ({ navigation }) => {
    const [datafavorite, setdataFavorite] = useState([
        { _id: 1, name: 'Bún', restaurantId: 'Nhà Hàng', description: 'Ngonn', image: 'https://static.vinwonders.com/production/bun-bo-hue-cau-giay-1.jpg' }
    ])

    const renderItem = ({ item }) => (
        <View>
            <View style={{ backgroundColor: '#FFE4C4', margin: 5, borderRadius: 10 }}>
                <TouchableOpacity
                    style={{ margin: 15, flexDirection: 'row', height: 90, alignItems: 'center' }}
                    onPress={() => navigation.navigate('ProductDetail', { product: item })}
                >
                    <View >
                        <Image source={{ uri: item.image }} style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25, borderRadius: 10 }} />
                    </View>
                    <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }} numberOfLines={2}>Tên món ăn:
                            {item.name}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>

                            <Text style={{ paddingBottom: 5, paddingTop: 5, fontWeight: 'bold', color: '#616161' }}>Nhà hàng: {item.restaurantId}</Text>
                        </View>
                        <Text style={{ color: '#616161', width: 0.6 * width, fontWeight: 'bold', paddingRight: 15 }} numberOfLines={4}>Mô tả: {item.description}</Text>
                    </View>
                </TouchableOpacity>


            </View>
        </View>
    );
    return (
        <SafeAreaView style={{ marginTop: 0, flex: 1, backgroundColor: 'white' }}>
            <ToolBar title="Sản phẩm yêu thích" onBackPress={() => navigation.goBack()} />
            <FlatList data={datafavorite}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem} />

        </SafeAreaView>
    )
}

export default ProductsFavorite

const styles = StyleSheet.create({

})