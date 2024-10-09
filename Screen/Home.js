import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import SliderHome from '../Item/SliderHome';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const HeaderHome = ({ navigation }) => {
  const [address, setAddress] = useState('Đang lấy vị trí...');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Nếu quyền bị từ chối, thông báo cho người dùng
        setAddress('Quyền truy cập vị trí bị từ chối. Vui lòng cấp quyền trong cài đặt.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 15000, // Thời gian chờ
        });

        let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
        if (reverseGeocode.length > 0) {
          let addr = reverseGeocode[0];
          let fullAddress = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`;
          setAddress(fullAddress.replace(/, ,/g, ',').replace(/,,/g, ',').trim());
        }
      } catch (error) {
        console.error("Lỗi khi lấy vị trí: ", error);
        setAddress("Không thể lấy vị trí.");
      }
    })();
  }, []);


  return (
    <View style={{ marginTop: 30 }}>
      <View style={{
        alignItems: 'center', flexDirection: 'row', backgroundColor: '#f5f5f5', borderRadius: 10, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}>
        <Image
          source={require('./../Image/placeholder.png')}
          style={{ width: 30, height: 30, margin: 15 }}
        />

        <Text style={{
          fontSize: 14,              // Tăng kích thước chữ một chút
          fontWeight: 'bold',
          color: '#333',             // Màu tối hơn cho dễ đọc
          flex: 1,
        }}>
          {address}
        </Text>

        <TouchableOpacity
          style={{
            marginLeft: 'auto',
            margin: 15,
            justifyContent: 'space-between'
          }}>
          <Image
            source={require('./../Image/Logo_BeeFood.png')}
            style={{ width: 50, height: 50, borderRadius: 20 }}
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
        <TouchableOpacity onPress={() => { navigation.navigate('Search') }} style={{ flex: 1 }}>
          <TextInput
            onFocus={() => { navigation.navigate('Search') }}
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
          <TouchableOpacity onPress={() => { navigation.navigate('Search') }}>
            <Image
              source={require('./../Image/search.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity >
        </View>
      </View>
    </View>
  );
};

const Menu = ({ navigation }) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 15 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('Ganban') }}>
            <Image source={require('./../Image/ganban.png')} style={{ width: 0.08 * width, height: 0.04 * height }} />
          </TouchableOpacity>

          <Text style={{ color: '#616161' }}>Món Bò</Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('Comxuat') }}>
            <Image source={require('./../Image/comxuat.png')} style={{ width: 0.08 * width, height: 0.04 * height }} />
          </TouchableOpacity>

          <Text style={{ color: '#616161' }}>Cơm xuất</Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('BunPho') }}>
            <Image source={require('./../Image/noodle.png')} style={{ width: 0.08 * width, height: 0.04 * height }} />
          </TouchableOpacity>

          <Text style={{ color: '#616161' }}>Bún phở</Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('Chicken') }}>
            <Image source={require('./../Image/fried_chicken.png')} style={{ width: 0.08 * width, height: 0.04 * height }} />
          </TouchableOpacity>

          <Text style={{ color: '#616161' }}>Gà rán</Text>
        </View>

      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('AnVat') }}>
            <Image source={require('./../Image/snack.png')} style={{ width: 0.08 * width, height: 0.04 * height }} />
          </TouchableOpacity>

          <Text style={{ color: '#616161' }}>Trà Sữa</Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 35 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('DoUong') }}>
            <Image source={require('./../Image/milk_tea.png')} style={{ width: 0.08 * width, height: 0.04 * height }} />
          </TouchableOpacity>

          <Text style={{ color: '#616161' }}>Đồ uống</Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('BanhMi') }}>
            <Image source={require('./../Image/burger.png')} style={{ width: 0.08 * width, height: 0.04 * height }} />
          </TouchableOpacity>
          <Text style={{ color: '#616161' }}>Bánh mì</Text>
        </View>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
          <TouchableOpacity onPress={() =>
            Toast.show({
              type: 'error',
              text1: 'Đang cập nhập thêm món ăn!',
              visibilityTime: 2000,
              position: 'bottom'
            })}>
            <Image source={require('./../Image/three-dots.png')} style={{ width: 0.07 * width, height: 0.04 * height }} />
          </TouchableOpacity>
          <Text style={{ color: '#616161' }}>Đồ Khác</Text>

        </View>

      </View>

    </View>

  )
}
const Restaurant = ({ navigation }) => {
  const [datarestauran, setdatarestauran] = useState([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(URL + 'api/restaurant/getAll');
  //       const jsonData = await response.json();
  //       const data = jsonData.data;
  //       let filterRestaurnats = data.filter(datarestaurnat => datarestaurnat.role === "user");
  //       setdatarestauran(filterRestaurnats);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [])

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 15, marginVertical: 8 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#616161' }}>Nhà hàng quanh đây</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllRestaurant')}>
          <Text>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {datarestauran.map((data, index) =>
          <View style={{ width: 250 }} key={data._id}>
            <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { restaurant: data._id })}>
              <View style={{ marginLeft: 15 }}>
                <Image source={{ uri: data.image }} style={{ width: 0.58 * width, height: 0.2 * height, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ADD8E6', marginLeft: 15, width: 0.58 * width, height: 0.08 * height }}>
                <View style={{ flexDirection: 'column', padding: 8 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#000000' }}>{data.name}</Text>
                  <Text style={{ fontWeight: 'bold', color: '#000000' }}>{data.timeon} AM - {data.timeoff} PM</Text>
                  <Text style={{ fontWeight: 'bold', color: '#000000' }}>{data.adress}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { restaurant: data._id })} style={{ marginLeft: 'auto', backgroundColor: '#FFFFFF', width: 0.06 * width, alignItems: 'center', justifyContent: 'center', height: 0.025 * height, borderRadius: 20, marginTop: 20, marginRight: 10 }} >
                  <Image source={require('./../Image/right_arrow.png')} style={{ width: 15, height: 15 }} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

const Goiymonan = ({ navigation }) => {
  const [datamonangoiy, setdatamonan] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch(URL + 'api/getTop');
  //     const jsonData = await response.json();
  //     const sortedData = jsonData.sort((a, b) => b.likeCount - a.likeCount);

  //     // Kiểm tra dữ liệu trước khi thiết lập state
  //     console.log('Dữ liệu từ API:', sortedData);

  //     setdatamonan(sortedData);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchData();
  //   }, [])
  // );

  return (
    <View style={{ margin: 15 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#616161' }}>
          Gợi ý dành cho bạn
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
          <Text>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {datamonangoiy.map((data, index) => (
          <View key={data._id || index} style={{ backgroundColor: '#FFE4C4', marginTop: 8, borderRadius: 10 }}>
            <TouchableOpacity
              style={{ margin: 15, flexDirection: 'row', alignItems: 'center' }}
              onPress={() => navigation.navigate('ProductDetail', { product: data })}
            >
              <Image
                source={{ uri: data.image }}
                style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25, borderRadius: 10 }}
              />
              <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000000' }}>
                  Tên món ăn: {truncateString(data.name, 13)}
                </Text>
                <Text style={{ paddingBottom: 5, paddingTop: 5, fontWeight: 'bold', color: '#000000' }}>
                  Nhà hàng: {data.restaurantId && data.restaurantId.name ? truncateString(data.restaurantId.name, 18) : 'Đang cập nhật...'}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require("./../Image/heart_1.png")}
                    style={{ width: 25, height: 25 }}
                  />
                  <Text style={{ color: '#000000', fontWeight: 'bold', marginLeft: 8 }}>
                    {data.likeCount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const Home = ({ navigation }) => {
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

        <HeaderHome navigation={navigation} />
        <SliderHome />
        <Menu navigation={navigation} />
        {/*   
        <Discountforeveryday /> */}
        <Restaurant navigation={navigation} />
        <Goiymonan navigation={navigation} />
      </ScrollView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})