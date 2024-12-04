import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { URL } from '../const/const'
import ToolBar from '../components/ToolBar'
const { width, height } = Dimensions.get('window')
const SearchComponent = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState([]);
  const handleButtonPress = () => {
    axios.post(URL + 'api/product/getbyname', {
      name: inputText
    }).then(response => {
      if (response.data.msg === 'Không tìm thấy sản phẩm nào.') {
        setData([])
      } else {
        setData(response.data);
        console.log(response.data, "DATA");

      }


    })
  };




  const numColumns = 3; // Số cột trên mỗi hàng
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / numColumns;

  const renderItem = ({ item }) => {
    return (
      <View style={{ margin: 15, flexDirection: 'row', height: 90, alignItems: 'center' }} >

        <View >
          <Image source={require('./../Image/imagedoan.png')} />
        </View>
        <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }}>{item.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{ uri: item.image }} style={{ width: 20, height: 20, marginTop: 5 }} />
            <Text style={{ padding: 5, fontWeight: 'bold', color: '#616161' }}>{item}</Text>
          </View>
          <Text style={{ color: '#616161' }}>{item}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 25 }}>
      <ToolBar title="Tìm kiếm" onBackPress={() => navigation.goBack()} />

      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={{
            width: 0.8 * width,
            height: 40,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: 'black',
            marginLeft: 15,
            marginTop: 15,
            paddingLeft: 10,
          }}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          placeholder="Nhập từ khóa tìm kiếm"
        />
        <View
          style={{
            width: 40,
            borderRadius: 15,
            marginLeft: 5,
            height: 40,
            backgroundColor: '#319AB4',
            justifyContent: 'center',
            marginTop: 15,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={handleButtonPress}>
            <Image
              source={require('./../Image/search.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) => {
            console.log(item.name);
            const product = item;
            const restaurantName = product.restaurantId?.name || 'Không xác định'; // Kiểm tra có dữ liệu không
            return (
              <TouchableOpacity
                style={{
                  margin: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc' // Màu xám nhạt cho line mờ
                }}
                onPress={() => { navigation.navigate('ProductDetail', { product }) }}
              >
                <View>
                  <Image
                    source={{ uri: product.image }}
                    style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25, borderRadius: 10 }}
                  />
                </View>
                <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10, flexShrink: 1 }}>
                  <Text
                    style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }}
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>
                  {/* Hiển thị tên nhà hàng */}
                  <Text style={{ color: '#616161', marginTop: 5 }}>
                    Nhà hàng: {restaurantName}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ paddingTop: 5, paddingBottom: 5, fontWeight: 'bold', color: '#616161' }}>
                      {product.realPrice} VND
                    </Text>
                  </View>
                  <Text style={{ color: '#616161', width: 0.6 * width }} numberOfLines={4}>
                    {product.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>

  )
}

export default SearchComponent

const styles = StyleSheet.create({})