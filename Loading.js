
import React from "react";
import {View, ActivityIndicator, Text, Dimensions} from 'react-native';

export const Loading =()=>{
    return (
    <View
        style={{ color: "white",borderColor:"white", width: 190
           // paddingVertical: 20
        }}
    >
        <Text style={{margin:2, color:'white', fontSize:15}} >Đang lấy dữ liệu...</Text>
            <ActivityIndicator animating size="large" color={"white"}/>
    </View>
    );
}