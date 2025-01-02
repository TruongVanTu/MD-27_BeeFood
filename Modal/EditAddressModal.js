import React, { useState } from 'react';
import { Modal, View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const EditAddressModal = ({ isVisible, setIsVisible, onConfirmAddress }) => {
  const [newAddress, setNewAddress] = useState('');

  const handleConfirm = () => {
    if (newAddress.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ mới.');
      return;
    }
    onConfirmAddress(newAddress);
    setNewAddress(''); // Reset input sau khi xác nhận
    setIsVisible(false);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setNewAddress(''); // Reset input khi hủy
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Cập nhật địa chỉ mới</Text>
          <View style={styles.infoContainer}>
            <Icon name="info-circle" size={24} color="#3498db" />
            <Text style={styles.infoText}>
              Vui lòng nhập địa chỉ của bạn!
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            onChangeText={setNewAddress}
            value={newAddress}
            multiline
            numberOfLines={6}
            placeholder="Nhập địa chỉ mới..."
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.touchableButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.touchableButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: { 
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: '90%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  textInput: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    textAlignVertical: 'top',
    width: '100%', 
  },
  touchableButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    elevation: 2,
    minWidth: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10, 
    backgroundColor: '#e8f4f8', 
    margin: 10, 
    borderRadius: 5,
  },
  infoText: {
    marginLeft: 10, 
    color: '#2980b9', 
    fontSize: 14, 
  },
});

export default EditAddressModal;
