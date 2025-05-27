import React, { useEffect, useState  } from "react";
import {
    View, Text, StyleSheet, TextInput, Button, SafeAreaView, ImageBackground, KeyboardAvoidingView,
    TouchableOpacity, Image, BackHandler, Modal, Pressable, Dimensions,FlatList, ScrollView
} from "react-native";
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
    const [modalVisible1, setModalVisible1] = useState(false);
    const [listSerice, setListService] = useState([]);
    const [listSericeX, setListServiceX] = useState([]);

    useEffect(() => {

        getDetails();
        getDetailsX();
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


    async function getDetails(){

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url:'http://103.125.189.238:8092/api/ATLD/GetDetails',
            headers: { }
        };

        await  axios.request(config)
            .then((response) => {
                if(response!==undefined)
                {
                   // console.log(response.data)
                    setListService(response.data)
                }
            })
            .catch((error) => {
                alert(error);
            });

    }

    async function getDetailsX(){

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url:'http://103.125.189.238:8092/api/ATLD/GetDetailsX',
            headers: { }
        };

        await  axios.request(config)
            .then((response) => {
                if(response!==undefined)
                {
                    console.log(response.data)
                    setListServiceX(response.data)
                }
            })
            .catch((error) => {
                alert(error);
            });

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

    const  renderItemService=  (item)  =>{
        return(
            <View style={{flex:1,
                flexDirection:'row',borderWidth:0.5,borderColor:"black", backgroundColor:'white'}}>
                <Text  style={{
                    flex: 1,paddingLeft: 1,fontWeight:400,
                    //backgroundColor:'black',
                    //borderWidth:0.5,borderColor:"black",borderLeftWidth: 0.5,
                    alignSelf: 'center',
                    color:'black', fontSize:12,alignItems:'stretch'}}>
                    {item.nhietdo}</Text>
                <View style={{borderLeftWidth:0.5,borderColor:"black", backgroundColor:'white'}}/>


                <Text  style={{
                    flex: 2,padding: 1,fontWeight:400,
                    alignSelf: 'center',
                    color:'black', fontSize:12,alignItems:'stretch'}}>
                    {item.muc}</Text>
                <View style={{borderLeftWidth:0.5,borderColor:"black", backgroundColor:'white'}}/>
                <Text  style={{
                    flex: 2,paddingLeft: 1,
                    alignSelf: 'center',fontWeight:400,
                    color:'black', fontSize:12,alignItems:'stretch'}}>
                    {item.nguyco}</Text>
                <View style={{borderLeftWidth:0.5,borderColor:"black", backgroundColor:'white'}}/>
                <Text  style={{
                    flex: 5,paddingLeft: 2,fontWeight:400,
                    alignSelf: 'center',
                    color:'black', fontSize:12,alignItems:'stretch'}}>
                    {item.kc}</Text>

            </View>
        );
    }

    const  renderItemServiceX=  (item)  =>{
        return(
            <View style={{flex:1,
                flexDirection:'row',borderWidth:0.5,borderColor:"black", backgroundColor:'white'}}>
                <Text  style={{
                    flex: 1,paddingLeft: 1,fontWeight:400,
                    //backgroundColor:'black',
                    //borderWidth:0.5,borderColor:"black",borderLeftWidth: 0.5,
                    alignSelf: 'center',
                    color:'black', fontSize:12,alignItems:'stretch'}}>
                    {item.nhietdo}</Text>
                <View style={{borderLeftWidth:0.5,borderColor:"black", backgroundColor:'white'}}/>


                <Text  style={{
                    flex: 3,paddingLeft: 1,fontWeight:400,
                    alignSelf: 'center',
                    color:'black', fontSize:12,alignItems:'stretch'}}>
                    {item.trieuchung}</Text>
                <View style={{borderLeftWidth:0.5,borderColor:"black", backgroundColor:'white'}}/>
                <Text  style={{
                    flex: 6,paddingLeft: 1,
                    alignSelf: 'center',fontWeight:400,
                    color:'black', fontSize:12,alignItems:'stretch'}}>
                    {item.xutri}</Text>


            </View>
        );
    }
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
              <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible1}
                  onRequestClose={() => {
                      setModalVisible1(!modalVisible1);
                  }}
              >
                  <ScrollView style={{
                      flex: 1,
                      //justifyContent: "center",
                      //alignItems: "center",

                      backgroundColor:"rgba(0,0,0, 0.60)",
                      marginTop: 22,
                      width: Dimensions.get('window').width
                  }}>
                      <View style={{
                          flex: 1,flexDirection:'space-between',
                          margin: 10,
                          width:Dimensions.get('window').width - 20,
                          // height: Dimensions.get('window').height *2 /3,
                          backgroundColor: "white",
                          borderRadius: 5,
                          padding: 2,
                          alignItems: "center",
                          shadowColor: "#000",
                          shadowOffset: {
                              width: 0,
                              height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 4,
                          elevation: 5,
                      }}>
                          <View style={{flexDirection: "row", display: "flex" , alignContent:'center'}}>
                              <MaterialCommunityIcons
                                  name="information-outline"
                                  color={"red"}
                                  size={25}

                              />
                              <Text style={{ color: "black", fontSize:20, marginLeft: 5 }}>1. Khuyến cáo dựa trên UCTI   </Text>

                          </View>
                          <View style={{flexDirection:'row',display:"flex", marginBottom: 15, borderBottomWidth: 1, borderTopWidth: 1}}>
                              <FlatList
                                  data={listSerice}
                                  ListHeaderComponent={() => {
                                      return (
                                          <View style={{flexDirection:'row', padding:5, marginLeft:-2,borderBottomWidth:1, borderBottomColor:'white', justifyContent:'space-between'}}>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>UTCI </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>   Mức độ </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>   Nguy cơ  </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>   Khuyến cáo </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>   </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>        </Text>
                                          </View>

                                      )
                                  }}
                                  renderItem={({ item }) => renderItemService(item)}
                                  keyExtractor={(item, id) => id.toString()}
                              />

                          </View>

                          <View style={{flexDirection: "row", display: "flex" , alignContent:'center'}}>

                              <Text style={{ color: "black", fontSize:20, marginLeft: 5 }}>2.Xử trí say nắng/say nóng theo UTCI   </Text>

                          </View>
                          <View style={{flexDirection:'row',display:"flex", marginBottom: 15, borderBottomWidth: 1, borderTopWidth: 1}}>
                              <FlatList
                                  data={listSericeX}
                                  ListHeaderComponent={() => {
                                      return (
                                          <View style={{flexDirection:'row', padding:5, marginLeft:-2,borderBottomWidth:1, borderBottomColor:'white', justifyContent:'space-between'}}>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>UTCI </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>Triệu chứng </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>   Xử trí  </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>   </Text>
                                              <Text  style={{color:'#00178d', fontSize:14,}}>        </Text>
                                          </View>

                                      )
                                  }}
                                  renderItem={({ item }) => renderItemServiceX(item)}
                                  keyExtractor={(item, id) => id.toString()}
                              />

                          </View>
                          <View style={{flex: 18,  flexDirection: "row", display: "none" ,padding: 10, alignContent:'center'}}>
                              <Text style={{
                                  flex: 1,
                                  backgroundColor: "white",
                                  borderWidth: 0.5,
                                  //margin: 10,
                                  padding: 5,
                                  alignItems: "center",
                                 // borderRadius: 10,
                                  borderColor: "black",
                                  //marginBottom: 20,
                                  //width: Dimensions.get('window').width
                              }}>{'<9'}</Text>
                              <Text style={{
                                  flex: 2,
                                  borderWidth: 0.5,
                                  padding: 5,
                                  borderColor: "black",
                              }}>Không căng thẳng nhiệt (lạnh)</Text>
                              <Text style={{
                                  flex: 2,
                                  borderWidth: 0.5,
                                  padding: 5,
                                  borderColor: "black",
                              }}>Không có  nguy cơ say nắng</Text>
                              <Text style={{
                                  flex: 5,
                                  borderWidth: 0.5,
                                  padding: 5,
                                  borderColor: "black",
                              }}>Chú ý mặc ấm tùy theo điều kiện nhiệt độ ngoài trời để tránh cơ thể nhiễm lạnh.</Text>
                          </View>

                          <Pressable
                              style={{
                                  borderWidth: 1,
                                  borderColor: "blue",
                                  padding: 10,
                                  backgroundColor: "green",
                                  //  marginBottom: 20
                              }}
                              onPress={() => setModalVisible1(!modalVisible1)}
                          >
                              <Text style={{ color: "white" }}>Close </Text>
                          </Pressable>
                      </View>
                  </ScrollView>
              </Modal>
              {messageFromChild !=='' ? (

                                   <View style={{
                      backgroundColor: "#18181b99",
                      borderRadius: 20,
                      padding: 10,
                      flex: 3,
                      margin: 10
                  }}>
               <TouchableOpacity
                   style={{
                       //marginRight: -20
                       //flexDirection: "row",
                       //display: "flex",
                       //justifyContent: "space-between",
                       //height:Dimensions.get('window').height/12,
                       // width:Dimensions.get('window').width/6,
                   }}
                   onPress={() => {
                       setModalVisible1(!modalVisible1)
                   }}
               >
                      <View style={{
                          flexDirection: "row",
                          justifyContent: "space-between", maginBottom: 10

                      }}>
                          <Text style={{
                              color: "#eee",
                              fontSize: 16,
                              fontWeight: "150",
                              padding:5
                          }}>KHUYẾN CÁO:</Text>
                          <MaterialCommunityIcons
                              name="help-circle-outline"
                              color={"#dde5dd"}
                              size={18}
                              style={{
                                  //backgroundColor: '#000000',
                                  marginLeft: -12,
                                  marginTop: 10
                              }}
                          />
                      </View>

                      <Text style={{
                          //flex: 1,  marginTop: -40,
                          color: "white",
                          margin: 5,
                          //alignSelf: "center",
                          fontWeight: "normal",
                          fontSize: 20,
                          alignItems: "center",
                          alignContent: "center",
                          marginLeft: 15,
                      }}>- Mang mặc: {messageFromChild.mangmac} </Text>
                      <Text style={{
                          //flex: 1,  marginTop: -40,
                          color: "white",
                          margin: 5,
                         // alignSelf: "center",
                          fontWeight: "normal",
                          fontSize: 20,
                          alignItems: "center",
                          alignContent: "center",
                          marginLeft: 15,
                      }}>- Bổ sung nước: {messageFromChild.uongnuoc} </Text>
                      <Text style={{
                          //flex: 1,  marginTop: -40,
                          margin: 5,
                          color: "white",
                         // alignSelf: "center",
                          fontWeight: "normal",
                          fontSize: 20,
                          alignItems: "center",
                          alignContent: "center",
                          marginLeft: 15,
                      }}>- Luyện tập: {messageFromChild.luyentap} </Text>
                      </TouchableOpacity>
                      </View>

                  )
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
                      <Text style={[styles.weatherItemTitle, {marginLeft:-80} ]}>UTCI</Text>
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