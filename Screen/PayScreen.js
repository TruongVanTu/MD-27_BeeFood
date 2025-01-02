import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, TextInput, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckOrderModal from '../Modal/CheckOderModal';
import SuccessModal from '../Modal/SuccessModal';
import ProductItemOder from '../Item/ProductItemOder';
import * as Location from 'expo-location';
import { URL } from '../const/const';
import ToolBar from '../components/ToolBar';
import Toast from 'react-native-toast-message';
import EditAddressModal from '../Modal/EditAddressModal';
import ListVoucherModal from '../Modal/ListVoucherModal';

const screenWidth = Dimensions.get('window').width;

const PayScreen = ({ route, navigation }) => {
  const { products, dataUid } = route.params;

  // ====== Thêm state để lưu toạ độ hiện tại của user ======  
  const [userLocation, setUserLocation] = useState(null);

  // ====== Thêm state để lưu toạ độ nhà hàng ======
  const [restaurantCoordinates, setRestaurantCoordinates] = useState({ latitude: null, longitude: null });
  const [isFetchingRestaurant, setIsFetchingRestaurant] = useState(true);

  const [totalproduct, settotalproduct] = useState(0);
  const [orderData, setOrderData] = useState({});
  const [text, setText] = useState('');
  const deliveryFee = 0;
  const [discount, setDiscount] = useState(0);
  const [IdVoucher, setDataIdVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isCheckOrderModalVisible, setCheckOrderModalVisible] = useState(false);
  const [isEditAddressModalVisible, setEditAddressModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isListVoucherModal, setIsListVoucherModal] = useState(false);
  const [voucher, setvoucher] = useState([]);
  const [address, setAddress] = useState('Đang lấy vị trí...');

  // ====== Hàm tính khoảng cách Haversine (tính bằng km) ======
  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Lấy danh sách voucher của nhà hàng:
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          URL + `api/voucher/getVoucherInRestaurant/${products[0].restaurantId}`
        );
        const jsonData = await response.json();
        const filteredVouchers = jsonData.list.filter(
          (voucher) => voucher.quantity > 0
        );
        setvoucher(filteredVouchers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Lấy vị trí người dùng và địa chỉ
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Quyền truy cập vị trí bị từ chối.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // Lưu lại toạ độ người dùng
      setUserLocation(location.coords);

      let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGeocode.length > 0) {
        let addr = reverseGeocode[0];
        let fullAddress = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''
          }, ${addr.region || ''}, ${addr.country || ''}`;
        setAddress(
          fullAddress.replace(/, ,/g, ',').replace(/,,/g, ',').trim()
        );
      }
    })();
  }, []);

  // ====== Hàm lấy tọa độ nhà hàng từ server ======
  const fetchRestaurantCoordinates = async (restaurantId) => {
    try {
      const response = await fetch(`${URL}api/getCoordinates/${restaurantId}`);
      const data = await response.json();
      if (response.ok) {
        const { latitude, longitude } = data;
        setRestaurantCoordinates({ latitude, longitude });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể lấy tọa độ nhà hàng.',
        });
      }
    } catch (error) {
      console.error('Error fetching restaurant coordinates:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi mạng',
        text2: 'Không thể kết nối tới máy chủ.',
      });
    } finally {
      setIsFetchingRestaurant(false);
    }
  };

  // Gọi hàm lấy tọa độ nhà hàng khi component mount
  useEffect(() => {
    const restaurantId = products[0].restaurantId;
    fetchRestaurantCoordinates(restaurantId);
  }, [products]);

  // Tính tổng tiền
  const toltalproducts = () => {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      let price = parseFloat(products[i].quantity * products[i].price);
      total += price;
    }
    settotalproduct(total);
  };

  useEffect(() => {
    toltalproducts();
  }, [products]);

  // Tạo dữ liệu đơn hàng
  const createOrderData = () => {
    let totalPrice = 0;
    products.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    // Lấy thời gian hiện tại + múi giờ Việt Nam
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // Định dạng: HH:mm:ss DD/MM/YYYY
    const formattedTime = `${vietnamTime
      .getUTCHours()
      .toString()
      .padStart(2, '0')}:${vietnamTime
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')}:${vietnamTime
          .getUTCSeconds()
          .toString()
          .padStart(2, '0')} ${vietnamTime
            .getUTCDate()
            .toString()
            .padStart(2, '0')}/${(vietnamTime.getUTCMonth() + 1)
              .toString()
              .padStart(2, '0')}/${vietnamTime.getUTCFullYear()}`;

    const orderData = {
      userId: dataUid,
      address: address,
      toltalprice: totalPrice + deliveryFee - discount,
      phuongthucthanhtoan: paymentMethod,
      status: 0,
      notes: text,
      voucherId: IdVoucher,
      time: formattedTime,
      products: products.map((product) => ({
        restaurantId: product.restaurantId,
        productId: product.productId,
        name: product.name,
        image: product.image,
        quantity: product.quantity,
        price: product.price,
      })),
    };

    return orderData;
  };

  // Gửi đơn hàng
  const sendOrderToServer = async (orderData) => {
    try {
      const response = await fetch(URL + 'api/history/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        Toast.show({
          type: 'info',
          text1: 'Lỗi đặt đơn hàng',
          text2: 'Vui lòng thử lại sau',
        });
        return;
      }

      console.log('Đơn hàng đã được tạo:', responseData);
      setTimeout(() => {
        setSuccessModalVisible(true);
      }, 200);
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi mạng',
        text2: 'Không thể kết nối tới máy chủ.',
      });
    }
  };

  // Khi người dùng bấm đặt hàng
  const handleOrderPress = () => {
    // Nếu địa chỉ vẫn đang lấy
    if (address === 'Đang lấy vị trí...') {
      Toast.show({
        type: 'info',
        text1: 'Vui lòng chờ',
        text2: 'Đang lấy vị trí của bạn...',
      });
      return;
    }

    // ====== Kiểm tra khoảng cách nhà hàng - người dùng (> 10km thì không cho đặt) ======
    // Kiểm tra nếu đang fetch tọa độ nhà hàng
    if (isFetchingRestaurant) {
      Toast.show({
        type: 'info',
        text1: 'Vui lòng chờ',
        text2: 'Đang lấy vị trí nhà hàng...',
      });
      return;
    }

    // Kiểm tra nếu không lấy được tọa độ nhà hàng
    if (!restaurantCoordinates.latitude || !restaurantCoordinates.longitude) {
      Toast.show({
        type: 'info',
        text1: 'Lỗi',
        text2: 'Không thể xác định vị trí nhà hàng.',
      });
      return;
    }

    // Kiểm tra nếu không lấy được vị trí người dùng
    if (!userLocation) {
      Toast.show({
        type: 'info',
        text1: 'Lỗi lấy vị trí',
        text2: 'Không thể xác định vị trí hiện tại của bạn.',
      });
      return;
    }

    const { latitude, longitude } = userLocation;
    const { latitude: restaurantLat, longitude: restaurantLng } = restaurantCoordinates;

    // Tính khoảng cách
    const distanceInKm = getDistanceInKm(latitude, longitude, restaurantLat, restaurantLng);
    console.log('Distance = ', distanceInKm, 'km');

    // Kiểm tra nếu > 10km
    if (distanceInKm > 10) {
      Toast.show({
        type: 'info',
        text1: 'Địa chỉ quá xa',
        text2: 'Vui lòng chọn địa điểm khác, vị trí hiện tại quá xa không thể thực hiện đặt đơn.',
      });
      return; // Không cho tiến hành đặt hàng
    }

    // Nếu khoảng cách hợp lệ, tạo dữ liệu và tiếp tục
    const newOrderData = createOrderData();
    setOrderData(newOrderData);

    // Kiểm tra phương thức thanh toán
    if (paymentMethod === 'bank') {
      // Thanh toán VNPay
      navigation.navigate('PaymentScreen', { orderData: newOrderData, products: products });
    } else {
      // Thanh toán tiền mặt
      setCheckOrderModalVisible(true);
    }
  };

  // Modal đổi địa chỉ
  const toggleEditAddressModal = () => {
    setEditAddressModalVisible(!isEditAddressModalVisible);
  };
  // Hàm xử lý khi người dùng xác nhận địa chỉ mới
  const handleConfirmAddress = async (newAddress) => {
    try {
      // Sử dụng Expo Location để geocode địa chỉ mới
      const geocodeResult = await Location.geocodeAsync(newAddress);
      console.log('Geocode Result:', geocodeResult);
      if (geocodeResult.length > 0) {
        const { latitude, longitude } = geocodeResult[0];
        setUserLocation({ latitude, longitude });
        setAddress(newAddress);
        Toast.show({
          type: 'success',
          text1: 'Địa chỉ đã được cập nhật',
          text2: 'Địa chỉ mới đã được lưu thành công.',
        });
        console.log('Updated User Location:', { latitude, longitude });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể xác định vị trí từ địa chỉ mới.',
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể xác định vị trí từ địa chỉ mới.',
      });
    }
  };


  // Modal voucher
  const toggleListVoucher = () => {
    setIsListVoucherModal(!isListVoucherModal);
  };
  const handleConfirmVoucher = (data) => {
    setDiscount(data);
  };
  const handleConfirmIDVoucher = (data) => {
    setDataIdVoucher(data);
  };

  // Một số tính toán hiển thị
  const ordertotalPrice = totalproduct + deliveryFee - discount;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToolBar title="Thanh Toán Đơn Hàng" onBackPress={() => navigation.goBack()} />

      <View style={styles.warningContainer}>
        <Icon name="exclamation-triangle" size={24} color="#FFCC00" />
        <Text style={styles.warningText}>
          Bạn có thể bấm thay đổi địa điểm, khi cập nhật địa chỉ quá lâu!
        </Text>
      </View>

      <View style={styles.container}>
        <ScrollView>
          <View style={styles.ngang}>
            <Text style={styles.deliveryText}>Giao hàng đến:</Text>
            <TouchableOpacity style={styles.buttondd} onPress={toggleEditAddressModal}>
              <Text>Thay đổi địa điểm</Text>
            </TouchableOpacity>
            <EditAddressModal
              isVisible={isEditAddressModalVisible}
              setIsVisible={setEditAddressModalVisible}
              onConfirmAddress={handleConfirmAddress}
            />
          </View>

          <Text style={styles.addressText}>{address}</Text>

          {/* Danh sách sản phẩm */}
          {products.map((product) => (
            <ProductItemOder key={product._id} products={product} />
          ))}

          {/* Lấy voucher */}
          <TouchableOpacity
            onPress={toggleListVoucher}
            style={styles.voucherButton}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonOrderText}>Lấy voucher</Text>
          </TouchableOpacity>
          <ListVoucherModal
            visible={isListVoucherModal}
            navigation={navigation}
            setisvisible={setIsListVoucherModal}
            products={voucher}
            onConfirmVoucher={handleConfirmVoucher}
            onConfirmIDVoucher={handleConfirmIDVoucher}
            totals={totalproduct}
          />

          {/* Tổng tiền, phí, discount */}
          <View style={styles.containerHD}>
            <View style={styles.row}>
              <Text style={styles.label}>Đơn mua</Text>
              <Text style={styles.value}>{totalproduct}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Phí giao hàng (dự kiến)</Text>
              <Text style={styles.value}>{deliveryFee}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Khuyến mãi</Text>
              <Text style={styles.value}>{discount}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalValue}>{ordertotalPrice}đ</Text>
            </View>
          </View>

          {/* Chọn phương thức thanh toán */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <RadioButton
              value="cash"
              status={paymentMethod === 'cash' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('cash')}
            />
            <Text style={{ marginHorizontal: 5 }}>Thanh toán bằng tiền mặt</Text>
            <Icon name="money" size={24} color="#319AB4" style={{ marginRight: 10 }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <RadioButton
              value="bank"
              status={paymentMethod === 'bank' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('bank')}
            />
            <Text style={{ marginHorizontal: 5 }}>Thanh toán bằng VNPay</Text>
            <Image
              source={require('../Image/vnpay-logo2.jpg')}
              style={{ marginRight: 10, width: 45, height: 40 }}
            />
          </View>

          {/* Lời nhắn */}
          <View style={styles.inputText}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Lời nhắn cho cửa hàng"
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          {/* Nút đặt hàng */}
          <TouchableOpacity
            onPress={handleOrderPress}
            style={styles.buttonOrder}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonOrderText}>Đặt hàng</Text>
          </TouchableOpacity>

          {/* Modal xác nhận đặt hàng */}
          <CheckOrderModal
            modalVisible={isCheckOrderModalVisible}
            setModalVisible={setCheckOrderModalVisible}
            orderData={orderData}
            onOrderSuccess={sendOrderToServer}
            products={products}
          />

          {/* Modal đặt thành công */}
          <SuccessModal
            isVisible={isSuccessModalVisible}
            navigation={navigation}
            products={products}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 9.5,
    padding: 0.05 * screenWidth,
  },
  ngang: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttondd: {
    borderRadius: 15,
    backgroundColor: '#009966',
    padding: 10,
  },
  deliveryText: {
    fontSize: 0.04 * screenWidth,
    marginVertical: 0.02 * screenWidth,
  },
  addressText: {
    fontSize: 0.045 * screenWidth,
    fontWeight: 'bold',
    marginBottom: 0.025 * screenWidth,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFBEA',
    margin: 10,
    borderRadius: 5,
  },
  warningText: {
    marginLeft: 10,
    color: '#555',
    fontSize: 10,
  },
  voucherButton: {
    backgroundColor: '#319AB4',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  containerHD: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputText: {
    marginBottom: 25,
  },
  textInput: {
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
  },
  buttonOrder: {
    backgroundColor: '#319AB4',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  buttonOrderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PayScreen;
