import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, Button, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, ScrollView, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stars from 'react-native-stars'; // Import from FontAwesome
import Toast from 'react-native-toast-message';

import { useCart } from '../Component/CartContext';

import CommentItem from '../Item/CommentItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { addproducttocart } from '../Redux/ActionAddtoCart';
import { URL } from '../const/const';
import ProductsFavorite from './ProductsFavorite';




const ProductDetailScreen = ({ navigation, route }) => {
  const { product, type } = route.params;
  console.log('type', type);
  const { state, dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product.realPrice);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [productfavorite, setproductfavorite] = useState(false)
  const dispatchproduct = useDispatch();
  const products = useSelector(state => state.products);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canComment, setCanComment] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  const [editingComment, setEditingComment] = useState(null); // Lưu trữ bình luận đang được chỉnh sửa



  const toggleDescription = () => {
    setIsExpanded(!isExpanded); // Chuyển đổi trạng thái giữa mở rộng và thu gọn
  };
  console.log(product.average);

  const [data, setData] = useState('');
  const ref = useRef()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('_id'); // Thay 'key' bằng khóa lưu trữ của bạn
        if (storedData !== null) {
          setData(storedData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

  }, []);

  useEffect(() => {
    const checkUserCommented = async () => {
      const storedUserId = await AsyncStorage.getItem('_id');
      const userAlreadyCommented = comments.some(comment => comment.idUser._id === storedUserId);
      setHasCommented(userAlreadyCommented);
    };

    checkUserCommented();
  }, [comments]);


  useEffect(() => {
    const checkUserPurchaseStatus = async () => {
      const storedUserId = await AsyncStorage.getItem('_id');
      const purchased = await hasPurchasedProduct(product._id, storedUserId);
      setCanComment(purchased); // Cập nhật trạng thái dựa trên kết quả
    };

    checkUserPurchaseStatus();
    fetchComments();
  }, []);



  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedUserId = await AsyncStorage.getItem('_id');

        if (storedUsername && storedUserId) {


          setCurrentUser({ username: storedUsername, _id: storedUserId });
          console.log("User name:", storedUsername);
          console.log("User ID:", storedUserId); // Log giá trị của userId
          // Log trạng thái đăng nhập là true
        } else {
          console.log("User ID:", storedUserId);  // Log trạng thái đăng nhập là false
        }

      } catch (error) {
        console.error('Error retrieving stored data:', error);
      }
    };
    // console.log("đây là id pr ==>>",product);
    checkLoginStatus();
    fetchComments()

  }, []);







  const fetchComments = async () => {
    try {
      let response = await fetch(URL + 'api/comment/getAll');
      let jsonResponse = await response.json();
      if (response.status === 200 || response.status === 304) {
        // Lọc các bình luận dựa trên idProduct._id
        let filteredComments = jsonResponse.data.filter(comment =>
          comment.idProduct?._id === product?._id);
        console.log("vippp ", filteredComments);
        console.log("vippp222 ", product._id);

        if (filteredComments.length > 0) {
          setComments(filteredComments);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi!',
          text2: jsonResponse.msg || 'Không thể lấy dữ liệu từ server',
        });
      }
    } catch (error) {
      console.log("vippp 4444", error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi!',
        text2: error.message || 'Không thể kết nối đến server',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasPurchasedProduct = async (productId, userId) => {
    try {
      const response = await fetch(`${URL}api/orders/getOrdersByUser/${userId}`);
      const jsonResponse = await response.json();

      // Kiểm tra nếu API trả về lỗi hoặc không có lịch sử đơn hàng
      if (!jsonResponse || jsonResponse.msg) {
        // console.warn("Không có lịch sử đơn hàng hoặc lỗi từ API:", jsonResponse.msg);
        return false; // Người dùng chưa mua sản phẩm
      }

      // Đảm bảo dữ liệu trả về là một mảng
      if (!Array.isArray(jsonResponse)) {
        console.error("Dữ liệu đơn hàng không hợp lệ:", jsonResponse);
        return false;
      }

      // Kiểm tra sản phẩm có trong danh sách đơn hàng
      const purchased = jsonResponse.some(order =>
        order.products.some(product => product.productId === productId)
      );
      return purchased;
    } catch (error) {
      console.error("Error checking purchase status:", error);
      return false; // Trả về false nếu có lỗi
    }
  };




  const submitComment = async () => {
    console.log("product id:", product._id);

    if (!newComment || newComment.trim() === "") {
      Toast.show({
        type: 'error',
        text1: 'Người dùng phải nhập bình luận, không được để trống!',
      });
      return;
    }

    const isLogin = await AsyncStorage.getItem('isLogin');
    const storedUserId = await AsyncStorage.getItem('_id');

    if (isLogin === 'false') {
      setNewComment('');
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để bình luận!",
        [
          {
            text: "Hủy bỏ",
            style: "cancel",
          },
          {
            text: "Đăng nhập",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
      return;
    }

    // Kiểm tra xem người dùng đã bình luận sản phẩm này chưa
    const userAlreadyCommented = comments.some(comment => comment.idUser._id === storedUserId);
    if (userAlreadyCommented) {
      Toast.show({
        type: 'error',
        text1: 'Bạn chỉ có thể bình luận một lần cho sản phẩm này!',
      });
      return;
    }

    // Kiểm tra xem người dùng đã mua sản phẩm này chưa
    const purchased = await hasPurchasedProduct(product._id, storedUserId);

    if (!purchased) {
      Alert.alert(
        "Thông báo",
        "Bạn chỉ có thể bình luận nếu đã mua sản phẩm này.",
        [{ text: "OK", style: "cancel" }]
      );
      return;
    }

    const apiUrl = `${URL}api/comment/create`;

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idProduct: product._id,
        idUser: storedUserId,
        title: newComment,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi mạng hoặc máy chủ");
        }
        return response.json();
      })
      .then((data) => {
        setComments((prevComments) => [...prevComments, data.comment]);
        setNewComment('');
        fetchComments();
        console.log("Bình luận thành công:", data);
      })
      .catch((error) =>
        console.error("Có lỗi khi thêm bình luận:", error)
      );
  };




  const goBack = () => {
    navigation.goBack();
  };
  const goCart = () => {
    navigation.navigate('Order');
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    setTotalPrice(product.realPrice * (quantity + 1));
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTotalPrice(product.realPrice * (quantity - 1));
    }
  };
  const saveDataToAsyncStorage = async (key, data) => {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      console.log('Data saved successfully.');
    } catch (error) {
      console.log('Error saving data: ', error);
    }
  };
  const deleteProduct = async (Uid) => {
    try {
      const apiUrl = `${URL}api/deletebyUid/${Uid}`; // Thay thế bằng URL API xóa sản phẩm
      const response = await fetch(apiUrl, { method: 'DELETE' });

      if (response.ok) {
        // Xóa sản phẩm thành công
        console.log('Xóa sản phẩm thành công');
      } else {
        // Xử lý lỗi nếu cần
        const errorData = await response.json();
        console.log('Lỗi xóa sản phẩm:', errorData.msg);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API xóa sản phẩm:', error);
    }
  };
  const saveObjectToMongoDB = (object) => {
    fetch(`${URL}api/add/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(object),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Object saved to MongoDB:', data);
        if (data.msg === 'Đang thêm sản phẩm không cùng 1 cửa hàng vào giỏ hàng') {

          console.log("sản phẩm thêm vào đang trùng id với sản phẩm có trong giỏ hàng");
          Alert.alert(
            'Cảnh báo!!',
            'Bạn chỉ được thêm sản phẩm trong cùng một nhà hàng vào giỏ hàng bạn có muốn tiếp tục?',
            [
              {
                text: 'Hủy',
                onPress: () => { return },
                style: 'cancel',
              },
              {
                text: 'Đồng ý',
                onPress: async () => {
                  console.log("data restauranid", product.restaurantId);
                  const storedUserId = await AsyncStorage.getItem('_id');
                  deleteProduct(storedUserId)
                  const isLogin = await AsyncStorage.getItem('isLogin');
                  if (isLogin === 'true') {
                    calculateTotalPrice();
                    const newCartProduct = {
                      userId: data,
                      restaurantName: product.restaurantId,
                      name: product.name,
                      image: product.image,
                      price: product.realPrice,
                      restaurant: product.restaurantId._id,
                      quantity: quantity,
                      productId: product._id
                    }
                    // Gọi hàm saveObjectToMongoDB với đối tượng bạn muốn gửi lên MongoDB
                    console.log("new product trong confirrm ", newCartProduct);
                    addToCart()
                  }
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Toast.show({
            type: 'success',
            text1: 'Món ngon đã được thêm vào giỏ hàng của bạn!',
            text2: 'Mời đến giỏ hàng',
          });
          setQuantity(1)
          setTotalPrice(product.realPrice)
        }


      })
      .catch((error) => {
        console.error('Error saving object to MongoDB:', error);
      });
  };
  useEffect(() => {
    console.log("product trong file detail", product.restaurantId);
  }, [])
  const addToCart = async () => {
    console.log("data restauranid", product.restaurantId._id);
    const isLogin = await AsyncStorage.getItem('isLogin');
    if (isLogin === 'true') {
      calculateTotalPrice();
      let resID;
      if (type === 'type') {
        resID = product.restaurantId
      }
      else if (type === undefined) {
        resID = product.restaurantId._id
      }
      const newCartProduct = {
        userId: data,
        restaurantName: product.restaurantId,
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.realPrice,
        restaurantId: resID,
        ischecked: false,
        quantity: quantity,

      }

      console.log("res id", product.restaurantId._id);
      // console.log('datrta',data);
      // console.log('datrta333',newCartProduct);


      // Gọi hàm saveObjectToMongoDB với đối tượng bạn muốn gửi lên MongoDB
      saveObjectToMongoDB(newCartProduct);


      console.log(data)


    } else {
      Toast.show({
        type: 'error',
        text1: 'Bạn phải đăng nhập mới được thêm đồ ăn',
      });
    }



  };
  useEffect(() => {
    console.log(products)
    saveDataToAsyncStorage('products', products)
  }, [products])


  const calculateTotalPrice = () => {
    let total = 0;
    state.cart.forEach((product) => {
      total += product.realPrice * product.quantity;
    });
    setTotalPrice(total);
  };
  useEffect(() => {
    console.log("product favorite ", productfavorite)
  }, [productfavorite])
  const addpProductfromfavorite = async () => {
    const isLogin = await AsyncStorage.getItem('isLogin');

    if (isLogin === 'false') {
      setNewComment('');
      Alert.alert(
        "Thông báo",
        "Vui lòng đăng nhập để thêm sản phẩm vào món ăn yêu thích!",
        [
          {
            text: "Hủy bỏ",
            style: "cancel",
          },
          {
            text: "Đăng nhập",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false }
      );
      return;
    }

    setproductfavorite(true)
    const storedUserId = await AsyncStorage.getItem('_id');

    console.log("data uid trong favotite", storedUserId);

    console.log("idproduct to add favorite", product._id);

    const dataproductFavorite = {
      userId: storedUserId,
      _id: product._id,
      isLiked: true
    }


    fetch(`${URL}api/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Các tiêu đề khác nếu cần thiết
      },
      body: JSON.stringify(dataproductFavorite), // Chuyển đối tượng thành chuỗi JSON
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData.msg);
      })
      .catch(error => {
        // Xử lý lỗi
      });

  }


  const getdataproductFavorite = async () => {
    const storedUserId = await AsyncStorage.getItem('_id');
    fetch(`${URL}api/favorite/getbyUid/${storedUserId}`)
      .then(response => response.json())
      .then(data => {
        let filteredComments = data[0].listFavorite.filter(dataproducts => dataproducts._id === product._id);

        if (filteredComments.length > 0) {
          console.log(" sản phẩm yêu thích", filteredComments);
          setproductfavorite(true)
        } else {
          setproductfavorite(false)
        }

      })
      .catch(error => {
        // Xử lý lỗi
      });
  }
  useEffect(() => {
    getdataproductFavorite()
  }, [product])

  const updateProductFromFavotite = async () => {
    setproductfavorite(false)
    const storedUserId = await AsyncStorage.getItem('_id');
    console.log("data uid trong favotite", storedUserId);

    console.log("idproduct to add favorite", product._id);

    const dataproductFavorite = {
      userId: storedUserId,
      _id: product._id,
      isLiked: false
    }
    fetch(`${URL}api/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Các tiêu đề khác nếu cần thiết
      },
      body: JSON.stringify(dataproductFavorite), // Chuyển đối tượng thành chuỗi JSON
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData.msg);
      })
      .catch(error => {
        // Xử lý lỗi
      });
  }

  const saveEditedComment = async (commentId) => {
    try {
      const response = await fetch(`${URL}api/comment/update/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingComment.text }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, title: editingComment.text } // Sử dụng nội dung mới
              : comment
          )
        );
        setEditingComment(null);
        Toast.show({
          type: 'success',
          text1: 'Bình luận đã được cập nhật!',
        });
      } else {
        const errorData = await response.json();
        console.error('Lỗi cập nhật bình luận:', errorData.msg);
        Toast.show({
          type: 'error',
          text1: 'Lỗi!',
          text2: errorData.msg || 'Không thể cập nhật bình luận',
        });
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi!',
        text2: 'Không thể kết nối đến server',
      });
    }
  };




  const renderLoading = () => (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </SafeAreaView>
  );

  const renderProductDetails = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Back button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("./../Image/left_arrow.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
          {/* Title */}
          <Text style={{ fontWeight: "bold", flex: 1, fontSize: 24 }}>
            {" "}
            Chi tiết sản phẩm{" "}
          </Text>

          {/* Cart button */}
          <TouchableOpacity style={styles.menuButton} onPress={goCart}>
            <Image
              source={require("./../Image/menu-icon.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {/* Product image */}
          <Image source={{ uri: product.image }} style={styles.image} />

          {/* Product name and price */}
          <View style={styles.contentRow}>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <Text style={styles.productPrice}>{product.realPrice} VND</Text>
          </View>

          {/* Product description */}
          <View style={styles.descriptionContainer}>
            <Text
              style={styles.description}
              numberOfLines={isExpanded ? undefined : 4} // Hiển thị 4 dòng nếu không mở rộng
              ellipsizeMode="tail" // Thêm "..." nếu bị cắt
            >
              {product.description}
            </Text>
            {product.description.length > 100 && ( // Chỉ hiển thị nút nếu mô tả dài
              <TouchableOpacity onPress={toggleDescription}>
                <Text style={styles.seeMore}>
                  {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            )}
          </View>



          <View style={{ flexDirection: 'row', margin: 5, alignItems: 'center' }}>
            <Text style={{ padding: 5, fontSize: 20, fontWeight: 'bold' }}>Món ăn yêu thích   </Text>
            {productfavorite ? (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn hủy sản phẩm khỏi danh sách yêu thích không?", [
                      {
                        text: "Hủy",
                        style: "cancel",
                      },
                      {
                        text: "Đồng ý",
                        onPress: () => {
                          updateProductFromFavotite()

                        },
                      },
                    ])
                  }
                >
                  <Image
                    source={require("./../Image/heart_1.png")}
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={() =>
                  addpProductfromfavorite()

                }>
                  <Image
                    source={require("./../Image/heart_2.png")}
                    style={{ width: 25, height: 25 }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Product rating */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={styles.danhGiaRow}>
              <Text style={styles.DanhgiaTitle}>
                Bình Luận
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Restaurant", {
                  restaurant: product.restaurantId._id,
                })
              }
            >
              <Text style={styles.DanhgiaTitle}>Đi đến nhà hàng</Text>
            </TouchableOpacity>
            
          </View>

          {/* Comments section */}
          <View style={styles.commentSection}>
            {hasCommented ? (
              <Text style={styles.alreadyCommentedText}>
                Bạn đã đánh giá sản phẩm này.
              </Text>
            ) : canComment ? (
              <>
                <TextInput
                  placeholder="Nhập bình luận..."
                  style={styles.commentInput}
                  multiline
                  onChangeText={(text) => setNewComment(text)}
                  value={newComment}
                />
                <TouchableOpacity onPress={submitComment}>
                  <Icon name="send" size={24} color="#319AB4" style={styles.sendIcon} />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.noCommentText}>
                Chỉ người dùng đã mua sản phẩm mới có thể bình luận.
              </Text>
            )}
          </View>

          <ScrollView style={styles.scrollView}>
            {comments.map((comment, index) =>
              editingComment?.id === comment._id ? (
                <View style={{flexDirection:'row', alignItems:'center'}} key={index}>
                  <TextInput
                    style={styles.commentInput}
                    value={editingComment.text}
                    onChangeText={(text) =>
                      setEditingComment((prev) => ({ ...prev, text }))
                    }
                  />
                  <TouchableOpacity style={{width:40, }} onPress={() => saveEditedComment(comment._id)}>
                    <Text style={{ color: 'blue' }}>Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingComment(null)}>
                    <Text style={{ color: 'red' }}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <CommentItem
                  key={index}
                  username={comment.idUser.username}
                  title={comment.title}
                  avatar={comment.idUser.avatar}
                  canEdit={comment.idUser._id === currentUser?._id}
                  onEdit={() => setEditingComment({ id: comment._id, text: comment.title })}
                />
              )
            )}

          </ScrollView>
        </ScrollView>

        {/* Bottom bar with quantity and payment button */}
        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <Text style={styles.totalPrice}>Total: {totalPrice} VND</Text>
            <Button title="-" onPress={decreaseQuantity} />
            <Text style={styles.quantityText}>{quantity}</Text>
            <Button title="+" onPress={increaseQuantity} />
          </View>
          <TouchableOpacity
            style={[styles.button, styles.bottomButton]}
            onPress={addToCart}
          >
            <Image
              source={require("./../Image/iconaddm.png")}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Thêm món</Text>
          </TouchableOpacity>
        </View>

        {/* Initialize Toast container */}
        {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
      </View >

      <View></View>
    </SafeAreaView >
  );

  return isLoading ? renderLoading() : renderProductDetails();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24, // Tăng khoảng cách giữa các dòng
  },
  seeMore: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 8
  },
  header: {
    height: 60,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1, // Thêm đường line ở cuối
    borderBottomColor: '#ddd', // Màu của đường line
    backgroundColor: 'transparent', // Loại bỏ màu nền // Thêm đường line ở cuối
  },
  scrollView: { margin: 10 },
  image: {
    width: '97%',
    borderRadius: 10,
    height: 200,
    marginBottom: 10,
    margin: 5
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  danhGiaRow: {
    flexDirection: 'row',
    padding: 5,
  },
  iconstar: {
    width: 10,
    height: 10,

  },
  productName: {
    padding: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  descriptionContainer: {
    padding: 8
  },
  description: {
    marginLeft: 10,
    fontSize: 16,
  },

  commentSection: {
    flexDirection: 'row',
    margin: 10,
  },
  commentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  DanhgiaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5, marginRight: 10
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  sendIcon: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 100,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  quantityText: {
    fontSize: 18,
  },
  totalPrice: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8
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
  buttonText2: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  menuButton: {
    padding: 10,
    borderRadius: 100,

  },


});

export default ProductDetailScreen;
