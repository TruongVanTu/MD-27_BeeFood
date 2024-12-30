import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import CryptoJS from 'crypto-js';
import * as Network from 'expo-network';
import { WebView } from 'react-native-webview';
import { URL } from '../const/const';
import SuccessModal from '../Modal/SuccessModal';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PaymentScreen = ({ route, navigation }) => {
  const { products, orderData } = route.params;
  const totalPrice = orderData.toltalprice;
  const [paymentUrl, setPaymentUrl] = useState('');
  const [encodedDateTime, setEncodedDateTime] = useState('');
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const vnp_TmnCode = '25QCPEV0';
  const vnp_HashSecret = '7QMLFPSU05CLBIUK168H1E8MCKUUA59R';

  const formatPayDate = (payDate) => {
    const year = payDate.substring(0, 4);
    const month = payDate.substring(4, 6);
    const day = payDate.substring(6, 8);
    const hour = payDate.substring(8, 10);
    const minute = payDate.substring(10, 12);
    const second = payDate.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const sendOrderToServer = async (transactionDetails) => {
    console.log('Data products:', products);
    console.log('Transaction Details:', transactionDetails);

    try {
      const response = await fetch(`${URL}api/history/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          transactionDetails,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.msg || 'Có lỗi xảy ra khi gửi đơn hàng.');
      }

      console.log('Đơn hàng đã được tạo:', responseData);

      setTimeout(() => {
        setSuccessModalVisible(true);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  const getExpireDateTime = (offsetMinutes = 30) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + offsetMinutes);

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  const generateRandomNumberString = (length) => {
    let randomString = '';
    while (randomString.length < length) {
      randomString += Math.random().toString().slice(2);
    }
    return randomString.substr(0, length);
  };

  const generateEncodedDateTime = () => {
    const currentDateTime = new Date();
    const formattedDateTime = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')} ${currentDateTime
      .getHours()
      .toString()
      .padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}:${currentDateTime
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;

    const originalString = `Thanh toan don hang thoi gian: ${formattedDateTime}`;
    const encodedString = encodeURIComponent(originalString).replace(/%20/g, '+');

    console.log("Encoded DateTime: " + encodedString);
    setEncodedDateTime(encodedString);
    return encodedString;
  };

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
      } catch (e) {
        console.error(e);
      }
    };

    fetchIpAddress();
  }, []);

  useEffect(() => {
    const createPaymentUrl = () => {
      const vnp_Params = {
        vnp_Amount: totalPrice * 100,
        vnp_BankCode: 'NCB',
        vnp_Command: 'pay',
        vnp_CreateDate: getCurrentDateTime(),
        vnp_CurrCode: 'VND',
        vnp_ExpireDate: getExpireDateTime(),
        vnp_IpAddr: ipAddress,
        vnp_Locale: 'vn',
        vnp_OrderInfo: generateEncodedDateTime(),
        vnp_OrderType: 'food',
        vnp_ReturnUrl: 'https%3A%2F%2Fsandbox.vnpayment.vn%2Ftryitnow%2FHome%2FVnPayReturn',
        vnp_TmnCode: vnp_TmnCode,
        vnp_TxnRef: generateRandomNumberString(6),
        vnp_Version: '2.1.0',
      };

      const sortedKeys = Object.keys(vnp_Params).sort();
      let signData = sortedKeys.map(key => `${key}=${vnp_Params[key]}`).join('&');

      const secureHash = CryptoJS.HmacSHA512(signData, vnp_HashSecret).toString(CryptoJS.enc.Hex);
      const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${signData}&vnp_SecureHash=${secureHash}`;

      return paymentUrl;
    };

    if (ipAddress) {
      const url = createPaymentUrl();
      console.log("Giá:", totalPrice);
      console.log("Order Data:", orderData);
      console.log("Payment URL:", url);
      setPaymentUrl(url);
    }
  }, [ipAddress, totalPrice, products]);

  const getQueryParams = (url) => {
    const params = {};
    const queryStart = url.indexOf('?') + 1;
    const queryEnd = url.indexOf('#') > -1 ? url.indexOf('#') : url.length;
    const query = url.slice(queryStart, queryEnd);
    const vars = query.split('&');
    vars.forEach((v) => {
      const pair = v.split('=');
      if (pair.length === 2) {
        params[pair[0]] = decodeURIComponent(pair[1]);
      }
    });
    return params;
  };

  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    console.log('Nav state =>', url);

    if (url.startsWith('https://sandbox.vnpayment.vn/tryitnow/Home/VnPayReturn')) {
      const queryParams = getQueryParams(url);
      console.log('Transaction Details:', queryParams);

      const responseCode = queryParams.vnp_ResponseCode;

      if (responseCode === '00') {
        setTransactionDetails(queryParams);
        sendOrderToServer(queryParams);
      } else {
        console.log('Thanh toán thất bại hoặc bị hủy');
        Alert.alert('Thanh toán thất bại', 'Giao dịch của bạn không thành công. Vui lòng thử lại.');
      }

      setPaymentUrl('');
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>Huỷ</Text>
        </TouchableOpacity>
      </View>

      <SuccessModal
        isVisible={isSuccessModalVisible}
        setSuccessModalVisible={setSuccessModalVisible}
        navigation={navigation}
        products={products}
        transactionDetails={transactionDetails}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {paymentUrl ? (
          <WebView
            source={{ uri: paymentUrl }}
            style={styles.webView}
            onNavigationStateChange={handleWebViewNavigationStateChange}
          />
        ) : transactionDetails ? (
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>Chi tiết giao dịch</Text>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Mã giao dịch:</Text>
              <Text style={styles.transactionValue}>{transactionDetails.vnp_TxnRef}</Text>
            </View>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Số tiền:</Text>
              <Text style={styles.transactionValue}>{(transactionDetails.vnp_Amount / 100).toLocaleString()} VND</Text>
            </View>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Ngày thanh toán:</Text>
              <Text style={styles.transactionValue}>{formatPayDate(transactionDetails.vnp_PayDate)}</Text>
            </View>
            <View style={styles.transactionRow}>
              <Text style={styles.transactionLabel}>Phương thức thanh toán:</Text>
              <Text style={styles.transactionValue}>{transactionDetails.vnp_BankCode}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.successText}>Đang tạo URL...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'transparent',
  },
  goBackButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  goBackButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  successText: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  transactionInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  transactionRow: {
    flexDirection: 'column',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  webView: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
});

export default PaymentScreen;

