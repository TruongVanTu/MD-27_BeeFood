import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native'
import SliderHome from '../Item/SliderHome';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location'; // Import Location từ expo-location
import { URL } from '../const/const';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

const HeaderHome = ({ navigation }) => {
  const [address, setAddress] = useState('Đang lấy vị trí...')

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Quyền truy cập vị trí bị từ chối.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGeocode.length > 0) {
        let addr = reverseGeocode[0];
        let fullAddress = `${addr.name || ''}, ${addr.subregion || ''}, ${addr.region || ''}, ${addr.country || ''}`;
        setAddress(fullAddress.replace(/, ,/g, ',').replace(/,,/g, ',').trim());
      }
    })();
  }, []);



  return (
    <View style={{ marginTop: 30, marginBottom: 10 }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10
      }}>
        <Image
          source={require('./../Image/placeholder.png')}
          style={{
            width: 30,
            height: 30,
            marginRight: 10
          }}
        />

        <Text style={{ fontSize: 14, fontWeight: '500', color: '#424242', flexShrink: 1 }}>
          {address}
        </Text>

        <TouchableOpacity
          style={{
            marginLeft: 'auto', // Đẩy logo về cuối dòng
            paddingLeft: 10,
          }}>
          <Image
            source={require('./../Image/Logo_BeeFood.png')}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1', marginLeft: 10, marginRight: 10
      }}>
        <Icon name='search' size={20} color='gray' style={{ marginLeft: 15 }} />
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { navigation.navigate('Search') }}>
          <TextInput
            onFocus={() => { navigation.navigate('Search') }}
            style={{
              height: 40,
              borderColor: '#f1f1f1',
              paddingLeft: 10,
              marginRight: 15
            }}
            placeholder="Nhập từ khóa tìm kiếm"
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Menu = ({ navigation }) => {
  return (
    <View>
      <View style={styles.menuContainer}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { navigation.navigate('Ganban') }}>
            <Image source={require('./../Image/ganban.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Món Bò</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { navigation.navigate('Comxuat') }}>
            <Image source={require('./../Image/comxuat.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Cơm xuất</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { navigation.navigate('BunPho') }}>
            <Image source={require('./../Image/noodle.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Bún phở</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { navigation.navigate('Chicken') }}>
            <Image source={require('./../Image/fried_chicken.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Gà rán</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { navigation.navigate('AnVat') }}>
            <Image source={require('./../Image/snack.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Trà Sữa</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { navigation.navigate('DoUong') }}>
            <Image source={require('./../Image/milk_tea.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Đồ uống</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => { navigation.navigate('BanhMi') }}>
            <Image source={require('./../Image/burger.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Bánh mì</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity onPress={() =>
            Toast.show({
              type: 'error',
              text1: 'Đang cập nhập thêm món ăn!',
              visibilityTime: 2000,
              position: 'bottom'
            })}>
            <Image source={require('./../Image/three-dots.png')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.text}>Đồ Khác</Text>
        </View>
      </View>
    </View>
  );
};

const Restaurant = ({ navigation }) => {
  const [datarestauran, setdatarestauran] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchLocationAndRestaurants = async () => {
      try {
        // Lấy vị trí hiện tại của người dùng
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Quyền truy cập vị trí bị từ chối.');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);

        // Lấy danh sách nhà hàng
        const response = await fetch(URL + 'api/restaurant/getAll');
        const jsonData = await response.json();
        const data = jsonData.data.filter(item => item.role === "user");

        // Tính khoảng cách và sắp xếp
        const restaurantsWithDistance = data.map(restaurant => {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            restaurant.latitude,
            restaurant.longitude
          );
          return { ...restaurant, distance };
        });

        restaurantsWithDistance.sort((a, b) => a.distance - b.distance);
        setdatarestauran(restaurantsWithDistance);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocationAndRestaurants();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // bán kính Trái đất trong km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // khoảng cách tính bằng km
    return distance;
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 15,
          marginVertical: 8,
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#616161' }}>
          Nhà hàng quanh đây
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllRestaurant')}>
          <Text style={{ color: '#007AFF' }}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {datarestauran.map((data, index) => (
          <View
            style={{
              width: width * 0.65,
              marginHorizontal: 10,
              marginTop: 15,
            }}
            key={data._id}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Restaurant', { restaurant: data._id })
              }
            >
              <View>
                <Image
                  source={{ uri: data.image }}
                  style={{
                    width: '100%',
                    height: height * 0.25,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  resizeMode="cover"
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#EEEEEE',
                  padding: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontWeight: 'bold', fontSize: 18, color: '#000000' }}
                  >
                    {data.name}
                  </Text>
                  <Text style={{ fontWeight: 'bold', color: '#000000' }}>
                    {data.timeon} AM - {data.timeoff} PM
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{ color: '#000000', width: 135 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {data.address}
                      </Text>
                    </View>
                    <Text style={{ color: '#000000', marginLeft: 8 }}>
                      {data.distance.toFixed(2)} km
                    </Text>
                  </View>
                </View>
                {/* <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Restaurant', { restaurant: data._id })
                  }
                  style={{
                    backgroundColor: '#FFFFFF',
                    width: 35,
                    height: 35,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 17.5,
                  }}
                >
                  <Image
                    source={require('./../Image/right_arrow.png')}
                    style={{ width: 15, height: 15 }}
                  />
                </TouchableOpacity> */}
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


const truncateString = (str, num) => {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

const Goiymonan = ({ navigation }) => {
  const [datamonangoiy, setdatamonan] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Quyền truy cập vị trí bị từ chối.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords); // Lưu tọa độ người dùng
    };

    fetchUserLocation();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính Trái đất (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Khoảng cách tính bằng km
  };


  useEffect(() => {
    const fetchUserLocationAndData = async () => {
      try {
        // Lấy vị trí người dùng
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Quyền truy cập vị trí bị từ chối.');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords); // Lưu vị trí người dùng

        // Gọi API sau khi đã có vị trí
        const response = await fetch(URL + 'api/getTop');
        const jsonData = await response.json();

        if (location.coords) {
          const dataWithDistance = jsonData.map(product => {
            const { restaurantId } = product;
            if (restaurantId && restaurantId.latitude && restaurantId.longitude) {
              const distance = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                restaurantId.latitude,
                restaurantId.longitude
              );
              return { ...product, distance };
            }
            return { ...product, distance: null }; // Nếu không có tọa độ
          });

          // Sắp xếp dữ liệu theo số lượt yêu thích
          const sortedData = dataWithDistance.sort((a, b) => b.likeCount - a.likeCount);

          setdatamonan(sortedData);
        } else {
          // Sắp xếp nếu không có vị trí người dùng
          const sortedData = jsonData.sort((a, b) => b.likeCount - a.likeCount);
          setdatamonan(sortedData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserLocationAndData();
  }, []);



  return (
    <View style={{ backgroundColor: '#f1f1f1' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', padding: 15 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#616161' }}>
          Gợi ý dành cho bạn
        </Text>
        {/* <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
          <Text>Xem tất cả</Text>
        </TouchableOpacity> */}
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        {datamonangoiy.map((data, index) => (
          <View key={data._id || index} style={{ backgroundColor: 'white', marginBottom: 10 }}>
            <TouchableOpacity
              style={{ margin: 15, flexDirection: 'row' }}
              onPress={() => navigation.navigate('ProductDetail', { product: data })}
            >
              <Image
                source={{ uri: data.image }}
                style={{ width: width * 0.25, height: width * 0.25 }}
              />
              <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: '600', fontSize: 15, color: '#000000', marginTop: 5 }}>
                  Tên món ăn: {truncateString(data.name, 20)}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ paddingBottom: 5, paddingTop: 5, fontWeight: '600', color: '#000000' }}>
                    Nhà hàng: {data.restaurantId && data.restaurantId.name ? truncateString(data.restaurantId.name, 18) : 'Đang cập nhật...'}
                  </Text>
                  <Text style={{ color: '#000000', fontWeight: '600', marginRight: 8, marginLeft: 100 }}>
                    {data.distance ? `${data.distance.toFixed(2)} km` : 'Đang tính toán...'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require("./../Image/heart_1.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={{ color: '#000000', fontWeight: '600', marginLeft: 8 }}>
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
    <View style={{ backgroundColor: '#f1f1f1' }}>
      <View style={{ backgroundColor: 'white' }}>
        <HeaderHome navigation={navigation} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}
        // StickyHeaderComponent={HeaderHome}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <SliderHome />
        <View style={{ backgroundColor: 'white' }}>
          <Menu navigation={navigation} />
        </View>
        <View style={styles.bgr}>
          <Restaurant navigation={navigation} />
        </View>

        <View style={styles.bgr}>
          <Goiymonan navigation={navigation} />
        </View>

      </ScrollView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '24%',
    marginBottom: 5,
    padding: 10,
    elevation: 5, // Độ cao của bóng cho Android
    shadowColor: '#000', // Màu bóng cho iOS
    shadowOffset: { width: 0, height: 2 }, // Vị trí bóng cho iOS
    shadowOpacity: 0.3, // Độ trong suốt của bóng cho iOS
    shadowRadius: 4, // Độ mờ của bóng cho iOS
  },
  icon: {
    width: 0.08 * width,
    height: 0.04 * height,
    marginBottom: 10,
  },
  text: {
    color: '#616161',
    fontSize: 14,
    fontWeight: '500',
  },
  bgr: {
    backgroundColor: 'white',
    marginTop: 12
  }
}); 