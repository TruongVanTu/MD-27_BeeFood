import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import SliderHome from '../Item/SliderHome';

const { width, height } = Dimensions.get('window');

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
        <SliderHome />
        <Menu />
        
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