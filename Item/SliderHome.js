import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const SliderHome = () => {
    const [index, setIndex] = useState(0);
    const [imageslider, setimageslider] = useState([
        { image: 'https://3adesign.vn/wp-content/uploads/trang-tri-nha-hang-thiet-ke-chi-phi-va-mau-thiet-ke-dep-hien-nay-2.jpg' },
        { image: 'https://3adesign.vn/wp-content/uploads/trang-tri-nha-hang-thiet-ke-chi-phi-va-mau-thiet-ke-dep-hien-nay-1.jpg' },
        { image: 'https://www.unileverfoodsolutions.com.vn/vi/goc-am-thuc/managing-your-restaurant/bi-quyet-toi-uu-cong-suat-nha-hang/jcr:content/parsys/header/articleheader/previewImage.transform/jpeg-optimized/image.1699320934875.jpg' },
        { image: 'https://muy.vn/wp-content/uploads/2024/04/gioi-thieu-1-1.jpg' },
        { image: 'https://salahome.vn/wp-content/uploads/2023/04/Enscape_2020-03-05-18-05-07-e1691989598946.png' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (imageslider.length > 0) {
                setIndex(prevIndex => (prevIndex + 1) % imageslider.length);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [imageslider]);

    return (
        <Swiper
            style={{ height: 0.25 * height}}
            showsButtons={false}
            autoplay={false}
            loop={false}
            index={index}
            onIndexChanged={(i) => setIndex(i)}
        >
            {imageslider.map((item, i) => (
                <View key={i} style={{ flex: 1 }}>
                    <Image
                        source={{ uri: item.image }}
                        style={{
                            width: 1 * width,
                            height: 0.25 * height,
                        }}
                        resizeMode='cover'
                    />
                </View>

            ))}
        </Swiper>
    )
}

export default SliderHome

const styles = StyleSheet.create({})