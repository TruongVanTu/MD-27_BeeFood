import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Platform, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';


const OrderScreen = ({ navigation, route }) => {
  const [products, setProducts] = useState([
    {
      name: 'Phở gà', price: 10000, quantity: 1, image: 'https://www.huongnghiepaau.com/wp-content/uploads/2017/08/cach-nau-pho-ga-ngon.jpg'
    }
  ]);
  const [selectallProducts, setSelectAllProducts] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0);


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
              <TouchableOpacity >
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
        <TouchableOpacity style={[styles.button, styles.bottomButton]}>
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
    backgroundColor: '#319AB4',
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