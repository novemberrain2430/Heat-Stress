import React, { useEffect, useState  } from "react";
import {View, Text, StyleSheet, TextInput, Button, SafeAreaView, ImageBackground, KeyboardAvoidingView,
    TouchableOpacity,Image, BackHandler } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import {Loading} from "./Loading";

import * as Location from "expo-location";

import axios from "axios";
import {useNavigation} from "@react-navigation/native";
import DateTime from "./DateTime";





export function DetailsScreen() {


  const navigation = useNavigation();



  const [messageFromChild, setMessageFromChild] = useState('');
    const [d1temp, setD1temp] = useState('');
    const [d2temp, setD2temp] = useState('');
    const [d3temp, setD3temp] = useState('');
    const [d1date, setD1Date] = useState('');
    const [d2date, setD2Date] = useState('');
    const [d3date, setD3Date] = useState('');
    const [d1w, setD1w] = useState('');
    const [d2w, setD2w] = useState('');
    const [d3w, setD3w] = useState('');
    const [icon3, setIcon3] = useState('');
    const [icon1, setIcon1] = useState('');
    const [icon2, setIcon2] = useState('');

    useEffect(() => {
        const onBackPress = () => {
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, []);


    const handleDataFromChild = (data) => {
        setMessageFromChild(data);
    };

    const handleDataFromChildTemp = (data) => {
        console.log(data[2].day.condition.icon)
        setD1temp(data[0].day.avgtemp_c);
        setD2temp(data[1].day.avgtemp_c);
        setD3temp(data[2].day.avgtemp_c);

       // var day1 = getDayName(data[0].date, "vi-VN");

        setD1Date(getDayName(data[0].date, "vi-VN"));
        setD2Date(getDayName(data[1].date, "vi-VN"));
        setD3Date(getDayName(data[2].date, "vi-VN"));

        setD1w(data[0].day.condition.text);
        setD2w(data[1].day.condition.text);
        setD3w(data[2].day.condition.text);

        setIcon1(`https:${data[0].day.condition.icon}`)
        setIcon2(`https:${data[1].day.condition.icon}`)
        setIcon3(`https:${data[2].day.condition.icon}`)
    };

    function getDayName(dateStr, locale)
    {
        var date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: 'long' });
    }



    const WeatherItem1 = ({ title, value, unit, icon }) => {
        return (
            <View style={styles.weatherItem}>

                <Text style={styles.weatherItemTitle}>{title}</Text>
                <Image
                    source={{
                        //uri: 'https://cdn.weatherapi.com/weather/64x64/night/296.png',
                        uri: icon,
                    }}
                    style={{ width: 30, height: 30 }}

                />
                <Text style={styles.weatherItemTitle}>  {value}</Text>
                <Text style={styles.weatherItemTitle}>
                    {unit.length <12 ? unit : unit.substring(0,12) + '...'}
                </Text>
            </View>
        );
    };

  return (

      <KeyboardAvoidingView
          behavior="height"
          keyboardVerticalOffset="0"
          enabled
          style={{ flex: 1 }}
      >
        <SafeAreaView style={{
            backgroundColor: "rgba(0,0,0, 0.150)",
            flex: 1,
            //marginTop:50,
            justifyContent: "flex-start",
        }}>
          <ImageBackground
              source={require('./assets/1097513.webp')}
              style={{
                flex:1,
                backgroundColor: "grey",
                flexDirection: "column",
                justifyContent: "flex-start",
               height: "100%",
                width: "100%",
              }}
          >

              <View style={{
                  backgroundColor: "rgba(0,0,0, 0.150)",
                  flex: 5,
                  justifyContent: "flex-start",
              }}>
                  <DateTime
                      onSendData={handleDataFromChild}
                      onSendDataTemp = {handleDataFromChildTemp}
                  />


              </View>
              {messageFromChild !=='' ?
                  (  <View style={{
                      backgroundColor: "rgba(0,0,0, 0.150)",
                      flex: 1,
                      // marginTop: -30,
                      justifyContent: "flex-start",
                  }}>
                      <Text style={{
                          flex: 1,
                          marginTop: -40,
                          color: "white",
                          alignSelf: "flex-start",
                          fontWeight: "normal",
                          fontSize: 16,
                          alignItems: "center",
                          alignContent: "center",
                          marginLeft: 15,
                      }}>Khuyến cáo: </Text>
                      <Text style={{
                          flex: 1,  marginTop: -40,
                          color: "white",
                          alignSelf: "center",
                          fontWeight: "normal",
                          fontSize: 20,
                          alignItems: "center",
                          alignContent: "center",
                          marginLeft: 15,
                      }}>{messageFromChild.kc} </Text>
                  </View>)
              : null}

              {messageFromChild !=='' ?
                  (
                      <View style={{
                  backgroundColor: "#18181b99",
                  borderRadius: 20,
                  padding: 10,
                  flex: 3,
                  margin: 10
              }}>
                  <View style={{
                      flexDirection: "row",
                      justifyContent: "space-between",

                  }}>
                      <Text style={{
                          color: "#eee",
                          fontSize: 16,
                          fontWeight: "150",
                          padding:5
                      }}>Dự báo 3 ngày</Text>
                      <Text style={[styles.weatherItemTitle, {marginLeft:-80} ]}>UCTI</Text>
                      <Text style={styles.weatherItemTitle}>

                      </Text>
                  </View>

                  <WeatherItem1
                      title={d1date}
                      value={d1temp}
                      icon={icon1}
                      unit={d1w}
                  />
                  <WeatherItem1
                      title={d2date}
                      value={d2temp}
                      icon={icon2}
                      unit={d2w}
                  />
                  <WeatherItem1
                      title={d3date}
                      value={d3temp}
                      icon={icon3}
                      //value={"28.3 °C"}
                      unit={d3w}
                  />
              </View> )
                      : null}
          </ImageBackground>
        </SafeAreaView>
      </KeyboardAvoidingView>



  );
}
DetailsScreen.navigationOptions = (props) => {
    //const {state, handleLogout, test} = useAuth();
    //console.log(props)
    //const {state, handleLogout} = useAuth();
    //const {navigate} = props.navigation;
    return {
        headerTitle: () => (
            <View
                style={{
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >

                <Text style={{ fontWeight: "bold", color: "green" }}>
                    {" "}
                   IỆT NAM
                </Text>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                    onPress={() => {
                        props.navigation.getParam("callingFun")();
                        props.navigation.navigate("Auth");
                    }}
                >
                    <MaterialCommunityIcons
                        name="logout"
                        color={"black"}
                        size={23}
                        style={{ marginRight: 7, marginLeft: 7 }}
                    />
                    <Text>Logx out</Text>
                </TouchableOpacity>
            </View>
        ),
    };
};


const styles = StyleSheet.create({
    container: {
        flex: 1.5,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15
    },
    heading: {
        fontSize: 45,
        fontStyle:"bold",
        color: "white",
        fontWeight: "100"
    },
    subheading: {
        fontSize: 25,
        color: "#eee",
        fontWeight: "300"
    },
    rightAlign: {
        flex: 4,
        textAlign: "right",
        marginTop: 100,
        //verticalAlign:'center'
        marginLeft:20
    },
    centerAlign: {
        textAlign: "center",
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        height: 40,
        // backgroundColor: "none",
        fontSize: 20,
        marginTop: 4,
        backgroundColor: "black"
    },
    timezone: {
        fontSize: 20,
        color: "white"
    },
    latlong: {
        fontSize: 16,
        color: "white",
        fontWeight: "700"
    },
    weatherItemContainer: {
        backgroundColor: "#18181b99",
        borderRadius: 10,
        padding: 10,
        marginTop: 10
    },
    weatherItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth:1,
        borderTopColor:"#ffffff"
    },
    weatherItemTitle: {
        color: "#eee",
        fontSize: 20,
        fontWeight: "150",
        padding:5
    }
});