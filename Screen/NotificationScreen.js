// NotificationScreen.js

import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { URL } from "../const/const";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

const NotificationScreen = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);
  const [dataUid, setDataUid] = useState("");
  const [currentNotifications, setCurrentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef(null);

  // Hàm lấy nhãn trạng thái đơn hàng (nếu cần)
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return 'Chờ xác nhận';
      case 1:
        return 'Đã xác nhận';
      case 2:
        return 'Đang giao';
      case 3:
        return 'Đã giao';
      case 4:
        return 'Đã huỷ';
      default:
        return 'Trạng thái không xác định';
    }
  };

  // Hàm tạo nội dung thông báo dựa trên trạng thái
  const getNotificationMessage = (status, orderId, money) => {
    switch (status) {
      case 0:
        return `Bạn đã đặt đơn hàng ${orderId} thành công với số tiền ${money} VND. Đơn hàng đang chờ xác nhận.`;
      case 1:
        return `Đơn hàng ${orderId} đã được xác nhận. Cảm ơn bạn đã đặt hàng!`;
      case 2:
        return `Đơn hàng ${orderId} đang được giao đến bạn. Vui lòng chuẩn bị nhận hàng.`;
      case 3:
        return `Đơn hàng ${orderId} đã được giao thành công. Chúc bạn ngon miệng!`;
      case 4:
        return `Đơn hàng ${orderId} đã bị huỷ. Vui lòng liên hệ hỗ trợ nếu cần.`;
      default:
        return `Đơn hàng ${orderId} có trạng thái không xác định.`;
    }
  };

  // Hàm tạo nội dung Toast dựa trên trạng thái
  const getToastMessage = (status, orderId, money) => {
    switch (status) {
      case 0:
        return {
          type: 'success',
          text1: 'Đơn hàng mới',
          text2: `Bạn đã đặt đơn hàng ${orderId} thành công với số tiền ${money} VND.`,
        };
      case 1:
        return {
          type: 'info',
          text1: 'Đơn hàng đã được xác nhận',
          text2: `Đơn hàng ${orderId} của bạn đã được xác nhận.`,
        };
      case 2:
        return {
          type: 'info',
          text1: 'Đơn hàng đang được giao',
          text2: `Đơn hàng ${orderId} của bạn đang được giao.`,
        };
      case 3:
        return {
          type: 'success',
          text1: 'Đơn hàng đã được giao',
          text2: `Đơn hàng ${orderId} của bạn đã được giao thành công.`,
        };
      case 4:
        return {
          type: 'error',
          text1: 'Đơn hàng đã bị huỷ',
          text2: `Đơn hàng ${orderId} của bạn đã bị huỷ.`,
        };
      default:
        return {
          type: 'info',
          text1: 'Thông báo',
          text2: `Đơn hàng ${orderId} của bạn có trạng thái mới.`,
        };
    }
  };

  // Hàm fetch dữ liệu lịch sử thông báo
  const fetchDataHistory = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("_id");
      if (!storedUserId) {
        console.warn("Không tìm thấy userId trong AsyncStorage.");
        setLoading(false);
        return;
      }
      setDataUid(storedUserId);

      const response = await fetch(`${URL}api/notify/${storedUserId}`);
      const data = await response.json();
      let notifications = data.listNotify || [];

      // Sắp xếp theo thời gian giảm dần
      notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Kiểm tra sự thay đổi so với lần fetch trước
      if (currentNotifications.length > 0) {
        notifications.forEach((newNotify) => {
          const oldNotify = currentNotifications.find((notify) => notify._id === newNotify._id);
          if (oldNotify) {
            if (oldNotify.status !== newNotify.status) {
              // Trạng thái đã thay đổi
              const toastMessage = getToastMessage(newNotify.status, newNotify.orderId, newNotify.money);
              Toast.show({
                type: toastMessage.type,
                text1: toastMessage.text1,
                text2: toastMessage.text2,
              });
            }
          } else {
            // Thông báo mới
            const toastMessage = getToastMessage(newNotify.status, newNotify.orderId, newNotify.money);
            Toast.show({
              type: toastMessage.type,
              text1: toastMessage.text1,
              text2: toastMessage.text2,
            });
          }
        });
      }

      setHistoryData(notifications);
      setCurrentNotifications(notifications);
    } catch (error) {
      console.error("Error fetching data:", error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tải thông báo.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm làm mới dữ liệu khi người dùng kéo xuống
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDataHistory();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Thiết lập polling khi component mount
  useEffect(() => {
    // Fetch dữ liệu lần đầu
    fetchDataHistory();

    // Thiết lập polling mỗi 30 giây
    intervalRef.current = setInterval(() => {
      fetchDataHistory();
    }, 30000); // 30000 ms = 30 giây

    // Dọn dẹp khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Hàm xử lý khi người dùng nhấp vào thông báo
  const handleDetail = (item) => {
    console.log('Clicked item:', item);
    const orderId = item.orderId || item._id; // Sử dụng orderId nếu có, nếu không dùng _id
    if (orderId) {
      navigation.navigate("Detailhistory", { orderId });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Không thể chuyển hướng',
        text2: 'Không tìm thấy ID đơn hàng.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("./../Image/Logo_BeeFood.png")} // Thay đổi đường dẫn ảnh nếu cần
          style={styles.logo}
        />
        <Text style={styles.title}>Notification Food</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Đang tải thông báo...</Text>
        </View>
      ) : (
        <FlatList
          data={historyData}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDetail(item)}>
              <View style={styles.notificationItem}>
                <View style={styles.notificationHeader}>
                  <Image
                    source={{
                      uri: "https://cdn4.vectorstock.com/i/1000x1000/92/63/complete-order-icon-in-line-style-for-any-projects-vector-35249263.jpg",
                    }}
                    style={styles.notificationImage}
                  />
                  <View style={styles.notificationInfo}>
                    <Text style={styles.notificationTitle}>Payment Order</Text>
                    <Text style={styles.notificationTime}>
                      {moment(item.createdAt).format("HH:mm - DD/MM")}
                    </Text>
                  </View>
                </View>
                <View style={styles.notificationDivider}></View>
                <Text style={styles.notificationBody} numberOfLines={3}>
                  {getNotificationMessage(item.status, item.orderId ?? item._id, item.money)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require("../Image/adress.png")}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>Không có thông báo nào.</Text>
            </View>
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0, // Điều này sẽ giữ khoảng cách trên Android, không có gì trên iOS
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1, // Thêm đường viền dưới cùng của header
    borderBottomColor: "#ccc", // Màu đường viền
  },
  logo: {
    width: 70,
    height: 50,
    marginRight: 8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  notificationItem: {
    backgroundColor: "#F2F6FD",
    borderBottomColor: "#DFE0EB",
    borderBottomWidth: 1,
    marginTop: 14,
    borderRadius: 18,
    marginHorizontal: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationImage: {
    width: 49,
    height: 49,
    borderRadius: 25,
  },
  notificationInfo: {
    justifyContent: "space-between",
    marginVertical: 3,
    marginLeft: 17,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    color: "#242426",
    fontWeight: '600',
  },
  notificationTime: {
    color: "#848688",
    fontSize: 12,
  },
  notificationDivider: {
    height: 1,
    backgroundColor: "#F2F2F2",
    marginTop: 12,
  },
  notificationBody: {
    textAlign: "left",
    marginLeft: 12,
    marginTop: 10,
    fontSize: 12,
    color: "#747475",
  },
  orderIdText: {
    color: "green",
    fontWeight: '600',
  },
  moneyText: {
    color: "red",
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationScreen;
