import { Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'

const HeaderHome = () =>{
  const [address, setAddress] = useState('Đang lấy vị trí...')

  return (
    <View style={{ marginTop: 30 }}>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Image
          source={require('./../Image/placeholder.png')}
          style={{ width: 30, height: 30, margin: 15 }}
        />

        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#616161' }}>
          {address}
        </Text>

        <TouchableOpacity
          style={{
            justifyContent: 'space-between',
            marginLeft: 'auto',
            margin: 15,
          }}>
          <Image
            source={require('./../Image/Logo_BeeFood.png')}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 25,
          color: '#319AB4',
          fontWeight: 'bold',
          marginStart: 15,
        }}>
        Welcome to BeeFood!
      </Text>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity >
          <TextInput
            style={{
              // width: 0.8 * width,
              height: 40,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: 'black',
              marginLeft: 15,
              paddingLeft: 10,
            }}
            placeholder="Nhập từ khóa tìm kiếm"
          />
        </TouchableOpacity>


        <View
          style={{
            flex: 0.2,
            // width: 40,
            borderRadius: 15,
            marginLeft: 5,
            marginRight: 15,
            height: 40,
            backgroundColor: '#319AB4',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity >
            <Image
              source={require('./../Image/search.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Đây là nơi bạn thực hiện việc tải lại dữ liệu
    // Ví dụ: fetchData().then(() => setRefreshing(false));
    setRefreshing(false); // Sau khi tải xong, đặt lại refreshing
  }, []);
  return (
    <View style={{ backgroundColor: 'white' }}>
      <ScrollView showsVerticalScrollIndicator={false}
        StickyHeaderComponent={HeaderHome}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        <HeaderHome />
        
      </ScrollView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})