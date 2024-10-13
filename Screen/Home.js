import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import SliderHome from '../Item/SliderHome';
import Toast from 'react-native-toast-message';


const { width, height } = Dimensions.get('window');

const HeaderHome = ({ navigation }) => {
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
        <TouchableOpacity onPress={() => { navigation.navigate('Search') }}>
          <TextInput
          onFocus={() => { navigation.navigate('Search') }}
            style={{
              width: 0.8 * width,
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
            flex: 1,
            // width: 40,
            borderRadius: 15,
            marginLeft: 5,
            marginRight: 15,
            height: 40,
            backgroundColor: '#319AB4',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => { navigation.navigate('Search') }} >
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
  const [datarestauran, setdatarestauran] = useState([
    {
      _id: 1, name: 'Nhà Hàng', timeon: '05:00', timeoff: '22:00', adress: 'Hà Nội', image: 'https://3adesign.vn/wp-content/uploads/trang-tri-nha-hang-thiet-ke-chi-phi-va-mau-thiet-ke-dep-hien-nay-2.jpg'
    },
    {
      _id: 2, name: 'Nhà Hàng', timeon: '05:00', timeoff: '22:00', adress: 'Hà Nội', image: 'https://3adesign.vn/wp-content/uploads/trang-tri-nha-hang-thiet-ke-chi-phi-va-mau-thiet-ke-dep-hien-nay-2.jpg'
    }, {
      _id: 3, name: 'Nhà Hàng', timeon: '05:00', timeoff: '22:00', adress: 'Hà Nội', image: 'https://3adesign.vn/wp-content/uploads/trang-tri-nha-hang-thiet-ke-chi-phi-va-mau-thiet-ke-dep-hien-nay-2.jpg'
    }, {
      _id: 4, name: 'Nhà Hàng', timeon: '05:00', timeoff: '22:00', adress: 'Hà Nội', image: 'https://3adesign.vn/wp-content/uploads/trang-tri-nha-hang-thiet-ke-chi-phi-va-mau-thiet-ke-dep-hien-nay-2.jpg'
    },
  ])

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
          <View key={data._id} style={{ width: 250, flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Restaurant')}>
              <View style={{ marginLeft: 15 }}>
                <Image source={{ uri: data.image }} style={{ width: 0.58 * width, height: 0.2 * height, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ADD8E6', marginLeft: 15, width: 0.58 * width, height: 0.08 * height }}>
                <View style={{ flexDirection: 'column', padding: 8 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#000000' }}> {data.name} </Text>
                  <Text style={{ fontWeight: 'bold', color: '#000000' }}> {data.timeon} AM - {data.timeoff} PM</Text>
                  <Text style={{ fontWeight: 'bold', color: '#000000' }}> {data.adress} </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Restaurant')} style={{ marginLeft: 'auto', backgroundColor: '#FFFFFF', width: 0.06 * width, alignItems: 'center', justifyContent: 'center', height: 0.025 * height, borderRadius: 20, marginTop: 20, marginRight: 10 }} >
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
  const [datamonangoiy, setdatamonan] = useState([
    { _id: '1', name: 'Bún chó', restaurant: 'Nhà Hàng', image: 'https://cdn3.ivivu.com/2022/09/bun-bo-hue-ivivu-4.jpg' },
    { _id: '2', name: 'Bún chó', restaurant: 'Nhà Hàng', image: 'https://cdn3.ivivu.com/2022/09/bun-bo-hue-ivivu-4.jpg' },
    { _id: '3', name: 'Bún chó', restaurant: 'Nhà Hàng', image: 'https://cdn3.ivivu.com/2022/09/bun-bo-hue-ivivu-4.jpg' },
    { _id: '4', name: 'Bún chó', restaurant: 'Nhà Hàng', image: 'https://cdn3.ivivu.com/2022/09/bun-bo-hue-ivivu-4.jpg' }
  ]);

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
              onPress={() => navigation.navigate('ProductDetail')}
            >
              <Image
                source={{ uri: data.image }}
                style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25, borderRadius: 10 }}
              />
              <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#000000' }}>
                  {data.name}
                </Text>
                <Text style={{ paddingBottom: 5, paddingTop: 5, fontWeight: 'bold', color: '#000000' }}>
                  {data.restaurant}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require("./../Image/heart_1.png")}
                    style={{ width: 25, height: 25 }}
                  />
                  <Text style={{ color: '#000000', fontWeight: 'bold', marginLeft: 8 }}>
                    10
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

        <Restaurant navigation={navigation} />
        <Goiymonan navigation={navigation} />

      </ScrollView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width / 2) - 120, // Điều chỉnh để phù hợp với kích thước màn hình
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
}); 