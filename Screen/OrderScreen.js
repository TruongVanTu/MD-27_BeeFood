import React, { useState } from 'react';
import { View, Text, CheckBox, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';

const OrderScreen = () => {
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Image source={require('./../Image/Logo_BeeFood.png')} style={styles.logo} />
      <Text style={styles.title}>Order Food</Text>
      
      {/* Product Selection Header */}
      <View style={styles.selectionHeader}>
        <Text style={styles.selectedText}>Selected Products</Text>
        <View style={styles.checkboxContainer}>
          <Text>Select all</Text>
          
        </View>
      </View>

      {/* Empty Cart Message */}
      <Text style={styles.emptyText}>Bạn chưa thêm sản phẩm nào vào giỏ hàng</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: 0 VND</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => {}}>
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Tab Menu (Optional - Placeholder) */}
      <View style={styles.bottomTab}>
        <Text>Home</Text>
        <Text>Order</Text>
        <Text>Notifications</Text>
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    width: '100%',
    paddingHorizontal: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#00A4E4',
    padding: 10,
    borderRadius: 5,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default OrderScreen;
