import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Swiper from 'react-native-swiper';

const { width,height } = Dimensions.get('window');

const SliderHome = () => {
    const [index, setIndex] = useState(0);
    const [imageslider, setimageslider] = useState([]);
  return (
    <Swiper
      style={{ height: 0.25 * height,margin: 15 }}
      showsButtons={false}
      autoplay={false}
      loop={false}
      index={index}
      onIndexChanged={(i) => setIndex(i)}
    >
     
        <View style={{ flex: 1 }}>
          <Image
            source={require('./../Image/banner.jpg')}
            style={{width: 0.925 * width,
                    height: 0.25 * height,
                    borderRadius: 15, }}
            resizeMode='cover'
          />
        </View>

    </Swiper>
  )
}

export default SliderHome

const styles = StyleSheet.create({})