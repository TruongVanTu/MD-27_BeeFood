import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icon library

const SearchComponent = ( { navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm kiếm</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập từ khóa tìm kiếm"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#00BFFF',
    padding: 10,
    borderRadius: 25,
  },
});

export default SearchComponent;
