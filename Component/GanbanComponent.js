import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native';
import ToolBar from '../components/ToolBar';
import { TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get('window');

const GanbanComponent = ({navigation}) => {
  const [ganban, setganban] = useState([
    { id: 1, image: 'https://media.istockphoto.com/id/1275830551/photo/bo-kho-recipe-this-vietnamese-beef-stew-has-all-the-flavors-of-a-traditional-beef-stew-with.jpg?s=612x612&w=0&k=20&c=EYkGnCMnlBVf4IdVcK9JYfFq8kD4XgnLC_QM7b4cdeo=', name: 'Bò kho', realPrice: 30000, description: "Bò kho siêu ngon " },
    { id: 2, image: 'https://media.istockphoto.com/id/1275830551/photo/bo-kho-recipe-this-vietnamese-beef-stew-has-all-the-flavors-of-a-traditional-beef-stew-with.jpg?s=612x612&w=0&k=20&c=EYkGnCMnlBVf4IdVcK9JYfFq8kD4XgnLC_QM7b4cdeo=', name: 'Bò kho', realPrice: 30000, description: "Bò kho siêu ngon " },
    { id: 3, image: 'https://media.istockphoto.com/id/1275830551/photo/bo-kho-recipe-this-vietnamese-beef-stew-has-all-the-flavors-of-a-traditional-beef-stew-with.jpg?s=612x612&w=0&k=20&c=EYkGnCMnlBVf4IdVcK9JYfFq8kD4XgnLC_QM7b4cdeo=', name: 'Bò kho', realPrice: 30000, description: "Bò kho siêu ngon " }

  ]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToolBar title="Món ngon về bò" onBackPress={() => navigation.goBack()} />

      <ScrollView >

        {ganban.map((data, index) =>

          <View key={index} style={{ backgroundColor: '#f0f0f0', marginTop: 6, marginRight: 5 }}>
            <TouchableOpacity
              style={{ margin: 15, flexDirection: 'row', height: 90}}
              onPress={() => navigation.navigate('ProductDetail', { product: data, type: 'type' })}
            >
              <View >
                <Image source={{ uri: data.image }} style={{ width: width * 0.25, height: width * 0.25 }} />
              </View>
              <View style={{marginLeft:10, marginTop:5}}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }} numberOfLines={2}>Tên món ăn: {data.name}
                </Text>
                <View style={{ flexDirection: 'row' }}>

                  <Text style={{ paddingTop: 5, paddingBottom: 5, fontWeight: 'bold', color: '#616161' }}>Giá: {data.realPrice}</Text>
                </View>
                <Text style={{ color: '#616161', width: 0.6 * width }} numberOfLines={4}>Mô tả:{data.description}</Text>
              </View>
            </TouchableOpacity>
          </View>

        )}
      </ScrollView>

    </SafeAreaView>
  )
}

export default GanbanComponent

const styles = StyleSheet.create({})