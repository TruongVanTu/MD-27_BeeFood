import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform, ScrollView, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';



const OrderScreen = ({ navigation, route }) => {
  const [products, setProducts] = useState([
    {
      _id: 1, name: 'Phở gà', price: 10000, quantity: 1, image: 'https://www.huongnghiepaau.com/wp-content/uploads/2017/08/cach-nau-pho-ga-ngon.jpg'
    }
  ]);
  const [selectallProducts, setSelectAllProducts] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0);
  const [dataUid, setDataUid] = useState('');


  useEffect(() => {
    calculateTotalPrice();
  }, [products]);

  const handleCheckoutPress = () => {
    if (products.length === 0) {
      Alert.alert(
        'Yêu Cầu',
        'Vui lòng thêm món vào giỏ hàng! Hãy đến của hàng để gọi món ngay thôi nào!',
        [
          { text: 'Home', onPress: () => navigation.navigate('Home') }, // Replace 'HomeScreen' with the actual home screen route name
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return
    }
    checkout();

  };
  const checkout = () => {
    // Create an array of product details
    // console.log('Checkout', products);

    const areAllChecked = products.every((product, index, array) => product.ischecked === false

    )

    console.log("dataa allllllllllllsdasdasdhahsdasjd", areAllChecked);

    if (areAllChecked == true) {
      alert("vui lòng lựa chọn món ăn để thanh toán")
      return
    }
    const selectedProducts = products.filter((product) => product.ischecked);
    navigation.navigate('PayScreen', { products: selectedProducts, dataUid });


  };

  const toggleProductSelection = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      ischecked: !updatedProducts[index].ischecked,
    };
    setProducts(updatedProducts);

    const areAllChecked = updatedProducts.every((product, index, array) => product.ischecked === true
    )

    if (areAllChecked == true) {
      setSelectAllProducts(true)
    } else {
      setSelectAllProducts(false)
    }

  };


  const calculateTotalPrice = () => {
    let total = 0;
    if (products && products.length >= 0) {
      products.forEach((product) => {
        if (product.ischecked == true) {
          total += (product.price * product.quantity);
        }
      });
      setTotalPrice(total);
    }
  };

  const updateSelectAllProducts = () => {

    if (products.length == 0) {
      alert("không có sản phẩm trong giỏ hàng")
      return
    }
    const updatedProducts = products.map((product) => ({
      ...product,
      ischecked: !selectallProducts,
    }));
    setProducts(updatedProducts);
    setSelectAllProducts(!selectallProducts);
  };

  const deleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      'Do you want to remove this item from the cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            console.log(product._id)
            deleteOrder(product._id)

            calculateTotalPrice()
          },
        },
      ]
    );
  };

  const deleteOrder = async (orderId) => {
    try {
      // Giả lập hành động xóa đơn hàng mà không gọi API
      console.log(`Xóa đơn hàng có ID: ${products._id}`);

      // Sau khi "xóa", bạn có thể gọi hàm fetchDataOder để cập nhật danh sách đơn hàng
      fetchDataOder();

      // Nếu cần, bạn có thể thông báo cho người dùng về việc đã xóa thành công
      // alert('Đơn hàng đã được xóa thành công!');

    } catch (error) {
      console.error(error); // Xử lý lỗi nếu có vấn đề xảy ra
      // Bạn có thể thông báo lỗi cho người dùng
      // alert('Đã có lỗi xảy ra trong quá trình xóa đơn hàng.');
    }
  };

  const fetchDataOder = async () => {
    try {
      // Lấy dữ liệu từ AsyncStorage
      const storedData = await AsyncStorage.getItem('_id');

      if (!storedData) {
        console.error('Không tìm thấy ID người dùng trong AsyncStorage');
        return;
      }

      // Dữ liệu giả lập thay vì gọi API
      const jsonData = [
        {
          _id: 1, name: 'Phở gà', price: 10000, quantity: 1, image: 'https://www.huongnghiepaau.com/wp-content/uploads/2017/08/cach-nau-pho-ga-ngon.jpg'
        },
        {
          _id: 1, name: 'Phở gà', price: 10000, quantity: 1, image: 'https://www.huongnghiepaau.com/wp-content/uploads/2017/08/cach-nau-pho-ga-ngon.jpg'
        }, {
          _id: 1, name: 'Phở gà', price: 10000, quantity: 1, image: 'https://www.huongnghiepaau.com/wp-content/uploads/2017/08/cach-nau-pho-ga-ngon.jpg'
        }
      ];

      // Lọc dữ liệu theo userId được lưu trữ
      const datafilter = jsonData.filter((obj) => obj.userId === storedData);

      // Cập nhật danh sách sản phẩm với trạng thái 'ischecked' mặc định là false
      const updatedProducts = datafilter.map((product) => ({
        ...product,
        ischecked: false,
      }));

      // Log dữ liệu để kiểm tra
      console.log('Dữ liệu đã lọc:', updatedProducts);

      // Cập nhật state sản phẩm
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
    }
  };


  const incrementQuantity = async (product, index) => {
    try {
      console.log("id cart product", product._id);

      const quantityproducts = product.quantity;
      const dataupdate = quantityproducts + 1;

      console.log("data update", quantityproducts)
      const updatedOrder = await updateOrder(product._id, dataupdate);
      // Sử dụng updatedOrder trong ứng dụng của bạn
      console.log("data after update", updatedOrder);

    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }

    calculateTotalPrice();
  };


  const decrementQuantity = async (product) => {

    try {
      console.log("id cart product", product._id);

      const quantityproducts = product.quantity;
      if (quantityproducts > 1) {
        const dataupdate = quantityproducts - 1;
        console.log("data update", quantityproducts)
        const updatedOrder = await updateOrder(product._id, dataupdate);
        // Sử dụng updatedOrder trong ứng dụng của bạn
        console.log("data after update", updatedOrder);
        fetchDataOder()
      } else {
        alert("số lượng phải lớn hơn 0")
      }



    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }
    calculateTotalPrice();


  };
  const updateOrder = () => {

  }


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('./../Image/Logo_BeeFood.png')} style={styles.logo} />
        <Text style={styles.title}>Order Food</Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.sectionTitle}>Selected Products</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.sectionTitle}>Select all</Text>
          <CheckBox
            checked={selectallProducts}
            onPress={() => updateSelectAllProducts()}
          />
        </View>
      </View>

      <ScrollView>
        {products && products.length > 0 ? (products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <CheckBox
              checked={product.ischecked}
              onPress={() => toggleProductSelection(index)}
            />
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price * product.quantity} VND</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => decrementQuantity(product)}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{product.quantity}</Text>
              <TouchableOpacity onPress={() => incrementQuantity(product, index)}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity onPress={() => deleteProduct(product)} >
                <Image source={require('./../Image/delete-icon.png')} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        ))) : <View>
          <Text>Bạn chưa thêm sản phẩm nào vào giỏ hàng </Text>
        </View>}
      </ScrollView>
      <View style={styles.bottomRow}>
        <Text style={styles.totalPrice}>Total: {totalPrice} VND</Text>
        <TouchableOpacity onPress={handleCheckoutPress} style={[styles.button, styles.bottomButton]}>
          <Text style={styles.buttonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 70,
    height: 50,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10, // Add borderRadius for rounded corners
  },

  productContainer: {
    margin: 15,
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-start', // Adjust to align items horizontally
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },

  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#616161',
    alignSelf: 'center', // Align center with the image
  },

  productPrice: {
    color: '#319AB4',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center', // Align center with the image
  },
  productContainer: {
    margin: 15,
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#616161',
  },
  productPrice: {
    color: '#319AB4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FF4500',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    paddingHorizontal: 8,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default OrderScreen;