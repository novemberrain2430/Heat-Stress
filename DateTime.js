import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity, Dimensions, Modal, Pressable} from "react-native";
import moment from "moment-timezone";
import {Loading} from "./Loading";

import * as Location from "expo-location";
import axios from "axios";
import {MaterialCommunityIcons} from "@expo/vector-icons";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const WeatherItem = ({ title, value, unit }) => {
  return (
    <View style={styles.weatherItem}>
      <Text style={styles.weatherItemTitle}>{title}</Text>
      <Text style={styles.weatherItemTitle}>
        {value}
        {unit}
      </Text>
    </View>
  );
};

const DateTime = ({onSendData ,onSendDataTemp , timezone  }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);

  const [data, setData] = useState({});
  const [data3Days, setData3Days] = useState({});
  const [current, setCurrent] = useState({});
  const [uIndex, setUIndex] = useState(0);
  const [uIndexStr, setUIndexStr] = useState({msg:'', kc:''});
  const [UCTI, setUCTI] = useState();
  const [UCTIStr, setUCTIStr] = useState();
  const [UctiMeaning,setUctiMeaning]= useState('');

  useEffect(() => {
    setInterval(() => {
      const time = new Date();
      const month = time.getMonth();
      const date = time.getDate();
      const day = time.getDay();
      const hour = time.getHours();
      const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
      const minutes = time.getMinutes();
      const ampm = hour >= 12 ? "pm" : "am";

      setTime(
        (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes) +
          ampm
      );

      setDate(days[day] + ", " + date + " " + months[month]);
    }, 1000);

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Xin hãy cho phép ứng dụng sử dụng dữ liệu vị trí trong Setting!")
        return;
      }
      setLoading(true)
      let location = await Location.getLastKnownPositionAsync({
        accuracy: 6
      }).then(currentPosition => {
        weatherapi(currentPosition.coords.latitude, currentPosition.coords.longitude);
      });

    })();


  }, []);

  const weatherapi = (latitude, longitude) => {
    setData({})

    if (latitude && longitude) {
      console.log(latitude);
      console.log(longitude);
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        //url: 'http://api.weatherapi.com/v1/current.json?key=f369d8de3c424ded99971707251505&q='+latitude+','+longitude+'&lang=vi',
        url:'http://103.125.189.238:8092/api/ATLD/GetWeather?lat='+latitude+'&lng='+longitude,
        headers: { }
      };

      axios.request(config)
          .then((response) => {
            if(response!==undefined)
            setData(response.data);

            console.log(JSON.stringify(response.data));
            let res= fetchUTCI(response.data.current.temp_c,response.data.current.humidity,response.data.current.wind_kph);
            setLoading(false)
          })
          .catch((error) => {
            alert(error);
          });


      let config1 = {
        method: 'get',
        maxBodyLength: Infinity,
        url:'http://103.125.189.238:8092/api/ATLD/GetWeatherFC?lat='+latitude+'&lng='+longitude,
        //url: 'http://api.weatherapi.com/v1/forecast.json?key=0e6377fc192f4b6da85173723250905&days=3&q='+latitude+','+longitude+'&lang=vi',
        headers: { }
      };

      axios.request(config1)
          .then((response) => {
            //console.log(response.data)
            if(response!==undefined  && response.data  && response.data.forecast && response.data.forecast.forecastday)
              setData3Days(response.data.forecast.forecastday);
            //console.log(JSON.stringify(response.forecast.forecastday));

            let myArray = response?.data?.forecast?.forecastday || [];
            //console.log(myArray)
                if(Array.isArray(myArray)){


                    let day1 = myArray[0]
                    let day2 = myArray[1]
                    let day3 = myArray[2]
                    let temp1 = Number(day1.day.avgtemp_c)
                    let hum1 = Number(day1.day.avghumidity)
                    let wind1 =Number(day1.day.maxwind_kph)

                    let temp2 = Number(day2.day.avgtemp_c)
                    let temp3 = Number(day3.day.avgtemp_c)
                    onSendDataTemp(myArray)


                }
            //let res= fetchUTCI(response.data.current.temp_c,response.data.current.humidity,response.data.current.wind_kph);
           // setLoading(false)
          })
          .catch((error) => {
            alert(error);
          });

    }
  };
  const WeatherIcon = ({ condition }) => {
    // Thêm giao thức https vào URL icon
    const iconUrl = `https:${condition.icon}`;

    return (
        <View style={{ alignItems: 'center' }}>
          <Image
              source={{ uri: iconUrl }}
              style={{ width: 64, height: 64 }} // Kích thước icon 64x64
              resizeMode="contain"
          />
          <Text>{condition.text}</Text> {/* Hiển thị mô tả thời tiết */}
        </View>
    );
  };
  function  fetchUTCI  (temperature, humidity, wind_kph)  {
   // console.log(temperature)
   // console.log(humidity)
   // console.log(wind_kph)
    if(temperature === 0 || humidity === 0) return;
    let uIndex =  UTCIcalculator(temperature, temperature, wind_kph, humidity);
    setUIndex(uIndex.UTCI)
   // console.log(uIndex.UTCI)
    let strArray =getUCTIStr(parseFloat(uIndex.UTCI))
    //console.log(JSON.stringify(strArray));
    if(strArray !==undefined){

    }


  };

  function Es(e){for(var r=[-2836.5744,-6028.076559,19.54263612,-.02737830188,16261698e-12,7.0229056e-10,-1.8680009e-13],t=e+273.15,n=2.7150305*Math.log(t),a=0;a<r.length;a++)n+=r[a]*t**(a-2);return n=.01*Math.exp(n)}
  function UTCIcalculator(e,r,t,n){t<.5?t=.5:t>17&&(t=17);var a=r-e,o=Es(e)*(n/100)/10,s=e+.607562052+-.0227712343*e+8.06470249*1e-4*e*e+1e-4*-1.54271372*e*e*e+-324651735e-14*e*e*e*e+7.32602852e-8*e*e*e*e*e+1.35959073*1e-9*e*e*e*e*e*e+-2.2583652*t+.0880326035*e*t+.00216844454*e*e*t+-153347087e-13*e*e*e*t+1e-7*-5.72983704*e*e*e*e*t+-2.55090145e-9*e*e*e*e*e*t+-.751269505*t*t+-.00408350271*e*t*t+1e-5*-5.21670675*e*e*t*t+1.94544667*1e-6*e*e*e*t*t+1.14099531*1e-8*e*e*e*e*t*t+.158137256*t*t*t+1e-5*-6.57263143*e*t*t*t+2.22697524*1e-7*e*e*t*t*t+1e-8*-4.16117031*e*e*e*t*t*t+-.0127762753*t*t*t*t+966891875e-14*e*t*t*t*t+2.52785852*1e-9*e*e*t*t*t*t+4.56306672*1e-4*t*t*t*t*t+1e-7*-1.74202546*e*t*t*t*t*t+-591491269e-14*t*t*t*t*t*t+.398374029*a+1.83945314*1e-4*e*a+-.00017375451*e*e*a+1e-7*-7.60781159*e*e*e*a+3.77830287e-8*e*e*e*e*a+5.43079673*1e-10*e*e*e*e*e*a+-.0200518269*t*a+.000892859837*e*t*a+3.45433048*1e-6*e*e*t*a+1e-7*-3.77925774*e*e*e*t*a+-1.69699377e-9*e*e*e*e*t*a+1.69992415*1e-4*t*t*a+-499204314e-13*e*t*t*a+2.47417178*1e-7*e*e*t*t*a+1.07596466e-8*e*e*e*t*t*a+8.49242932*1e-5*t*t*t*a+135191328e-14*e*t*t*t*a+-6.21531254e-9*e*e*t*t*t*a+-499410301e-14*t*t*t*t*a+-1.89489258e-8*e*t*t*t*t*a+8.15300114*1e-8*t*t*t*t*t*a+.00075504309*a*a+1e-5*-5.65095215*e*a*a+-4.52166564e-7*e*e*a*a+2.46688878e-8*e*e*e*a*a+2.42674348e-10*e*e*e*e*a*a+.00015454725*t*a*a+52411097e-13*e*t*a*a+-8.75874982e-8*e*e*t*a*a+-1.50743064e-9*e*e*e*t*a*a+-156236307e-13*t*t*a*a+-1.33895614e-7*e*t*t*a*a+2.49709824*1e-9*e*e*t*t*a*a+6.51711721e-7*t*t*t*a*a+1.94960053e-9*e*t*t*t*a*a+1e-8*-1.00361113*t*t*t*t*a*a+1e-5*-1.21206673*a*a*a+-2.1820366e-7*e*a*a*a+7.51269482*1e-9*e*e*a*a*a+9.79063848e-11*e*e*e*a*a*a+125006734e-14*t*a*a*a+1e-9*-1.81584736*e*t*a*a*a+1e-10*-3.52197671*e*e*t*a*a*a+-3.3651463e-8*t*t*a*a*a+1.35908359*1e-10*e*t*t*a*a*a+4.1703262e-10*t*t*t*a*a*a+1e-9*-1.30369025*a*a*a*a+4.13908461*1e-10*e*a*a*a*a+9.22652254e-12*e*e*a*a*a*a+-5.08220384e-9*t*a*a*a*a+1e-11*-2.24730961*e*t*a*a*a*a+1.17139133e-10*t*t*a*a*a*a+6.62154879e-10*a*a*a*a*a+4.0386326e-13*e*a*a*a*a*a+1.95087203e-12*t*a*a*a*a*a+-4.73602469e-12*a*a*a*a*a*a+5.12733497*o+-.312788561*e*o+-.0196701861*e*e*o+9.9969087*1e-4*e*e*e*o+951738512e-14*e*e*e*e*o+-4.66426341e-7*e*e*e*e*e*o+.548050612*t*o+-.00330552823*e*t*o+-.0016411944*e*e*t*o+-516670694e-14*e*e*e*t*o+9.52692432*1e-7*e*e*e*e*t*o+-.0429223622*t*t*o+.00500845667*e*t*t*o+100601257e-14*e*e*t*t*o+-181748644e-14*e*e*e*t*t*o+.001*-1.25813502*t*t*t*o+-.000179330391*e*t*t*t*o+2.34994441*1e-6*e*e*t*t*t*o+1.29735808*1e-4*t*t*t*t*o+12906487e-13*e*t*t*t*t*o+-228558686e-14*t*t*t*t*t*o+-.0369476348*a*o+.00162325322*e*a*o+1e-5*-3.1427968*e*e*a*o+259835559e-14*e*e*e*a*o+-4.77136523e-8*e*e*e*e*a*o+.0086420339*t*a*o+-.000687405181*e*t*a*o+1e-6*-9.13863872*e*e*t*a*o+5.15916806e-7*e*e*e*t*a*o+1e-5*-3.59217476*t*t*a*o+3.28696511*1e-5*e*t*t*a*o+-7.10542454e-7*e*e*t*t*a*o+-1243823e-11*t*t*t*a*o+-7.385844e-9*e*t*t*t*a*o+2.20609296*1e-7*t*t*t*t*a*o+1e-4*-7.3246918*a*a*o+1e-5*-1.87381964*e*a*a*o+480925239e-14*e*e*a*a*o+-8.7549204e-8*e*e*e*a*a*o+2.7786293*1e-5*t*a*a*o+-506004592e-14*e*t*a*a*o+1.14325367e-7*e*e*t*a*a*o+253016723e-14*t*t*a*a*o+-1.72857035e-8*e*t*t*a*a*o+1e-8*-3.95079398*t*t*t*a*a*o+-3.59413173e-7*a*a*a*o+7.04388046*1e-7*e*a*a*a*o+-1.89309167e-8*e*e*a*a*a*o+1e-7*-4.79768731*t*a*a*a*o+7.96079978e-9*e*t*a*a*a*o+1.62897058*1e-9*t*t*a*a*a*o+3.94367674e-8*a*a*a*a*o+-1.18566247e-9*e*a*a*a*a*o+3.34678041*1e-10*t*a*a*a*a*o+-1.15606447e-10*a*a*a*a*a*o+-2.80626406*o*o+.548712484*e*o*o+-.0039942841*e*e*o*o+-.000954009191*e*e*e*o*o+193090978e-13*e*e*e*e*o*o+-.308806365*t*o*o+.0116952364*e*t*o*o+.000495271903*e*e*t*o*o+-190710882e-13*e*e*e*t*o*o+.00210787756*t*t*o*o+1e-4*-6.98445738*e*t*t*o*o+230109073e-13*e*e*t*t*o*o+.00041785659*t*t*t*o*o+1e-5*-1.27043871*e*t*t*t*o*o+-304620472e-14*t*t*t*t*o*o+.0514507424*a*o*o+-.00432510997*e*a*o*o+899281156e-13*e*e*a*o*o+1e-7*-7.14663943*e*e*e*a*o*o+-.000266016305*t*a*o*o+.000263789586*e*t*a*o*o+1e-6*-7.01199003*e*e*t*a*o*o+1e-4*-1.06823306*t*t*a*o*o+361341136e-14*e*t*t*a*o*o+2.29748967e-7*t*t*t*a*o*o+.000304788893*a*a*o*o+-642070836e-13*e*a*a*o*o+116257971e-14*e*e*a*a*o*o+7.68023384*1e-6*t*a*a*o*o+-5.47446896e-7*e*t*a*a*o*o+-3.5993791e-8*t*t*a*a*o*o+-436497725e-14*a*a*a*o*o+1.68737969*1e-7*e*a*a*a*o*o+2.67489271e-8*t*a*a*a*o*o+3.23926897*1e-9*a*a*a*a*o*o+-.0353874123*o*o*o+-.22120119*e*o*o*o+.0155126038*e*e*o*o*o+-.000263917279*e*e*e*o*o*o+.0453433455*t*o*o*o+-.00432943862*e*t*o*o*o+.000145389826*e*e*t*o*o*o+2.1750861*1e-4*t*t*o*o*o+-666724702e-13*e*t*t*o*o*o+33321714e-12*t*t*t*o*o*o+-.00226921615*a*o*o*o+.000380261982*e*a*o*o*o+-5.45314314e-9*e*e*a*o*o*o+1e-4*-7.96355448*t*a*o*o*o+2.53458034*1e-5*e*t*a*o*o*o+1e-6*-6.31223658*t*t*a*o*o*o+.000302122035*a*a*o*o*o+-477403547e-14*e*a*a*o*o*o+173825715e-14*t*a*a*o*o*o+-4.09087898e-7*a*a*a*o*o*o+.614155345*o*o*o*o+-.0616755931*e*o*o*o*o+.00133374846*e*e*o*o*o*o+.00355375387*t*o*o*o*o+1e-4*-5.13027851*e*t*o*o*o*o+1.02449757*1e-4*t*t*o*o*o*o+-.00148526421*a*o*o*o*o+-411469183e-13*e*a*o*o*o*o+-680434415e-14*t*a*o*o*o*o+-977675906e-14*a*a*o*o*o*o+.0882773108*o*o*o*o*o+-.00301859306*e*o*o*o*o*o+.00104452989*t*o*o*o*o*o+.000247090539*a*o*o*o*o*o+.00148348065*o*o*o*o*o*o;return{UTCI:s,stress:s<=-13?-3:s>-13&&s<=0?-2:s>0&&s<=9?-1:s>9&&s<=26?0:s>26&&s<=28?1:s>28&&s<=32?2:3}}

 async function getUCTIStr (temp){

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url:'http://103.125.189.238:8092/api/ATLD/GetRecommend?temp='+temp.toFixed(2),
      headers: { }
    };

  await  axios.request(config)
        .then((response) => {
          //console.log(JSON.stringify(response.data));
          if(response!==undefined)
          {
              setUctiMeaning(response.data.umeaning)
            setUIndexStr(response.data)
            onSendData(response.data)
          }
        })
        .catch((error) => {
          alert(error);
        });

  }
  function getUCTIStr1(temp){
    console.log(temp)
    let str={};

    /*
        if(temp > 46) str = {msg:"Căng thẳng nhiệt độ cực cao", kc:"Bắt buộc làm mát cơ thể ngay, không hoạt động thể chất, uống nước >0.5l/h."};
   else if(38 < temp <= 46) str = {msg:"Căng thẳng nhiệt rất mạnh", kc:"Nên sử dụng các phương tiện làm mát cơ thể. Cần nghỉ ngơi nơi râm mát, giảm hoạt động thể chất. Uống nước > 0.5l/h."};
    else   if(32 < temp <= 38) str = {msg:"Căng thẳng nhiệt mạnh", kc:"Cần nghỉ ngơi nơi râm mát, giảm tạm thời hoạt động thể chất. Uống nước > 0.25l/h."};
    else  if(26 < temp && temp <= 32) str = {msg:"Căng thẳng nhiệt vừa phải", kc:"Uống nước > 0.25l/h."};
    else  if(9 < temp <= 26) str = {msg:"Không có ứng suất nhiệt", kc:"Một số quần áo ấm, găng tay, mũ"};
    else  if(0 < temp <= 9) str = {msg:"Căng thẳng lạnh nhẹ", kc:"Tăng cường hoạt động, bảo vệ mặt và các chi."};
    */
    switch(true) {
      case temp > 46:
        str = {msg:"Căng thẳng nhiệt rất mạnh", kc:"Nên sử dụng các phương tiện làm mát cơ thể. Cần nghỉ ngơi nơi râm mát, giảm hoạt động thể chất. Uống nước > 0.5l/h."};
        break;
      case 38 < temp && temp <= 46:
        str = {msg:"Căng thẳng nhiệt rất mạnh", kc:"Nên sử dụng các phương tiện làm mát cơ thể. Cần nghỉ ngơi nơi râm mát, giảm hoạt động thể chất. Uống nước > 0.5l/h."};
        break;
      case 32 < temp && temp <= 38:
        str = {msg:"Căng thẳng nhiệt mạnh", kc:"Cần nghỉ ngơi nơi râm mát, giảm tạm thời hoạt động thể chất. Uống nước > 0.25l/h."};
        break;
      case 26 < temp && temp <= 32:
        str = {msg:"Căng thẳng nhiệt vừa phải", kc:"Uống nước > 0.25l/h."};
        break;
      case 9 < temp && temp <= 26:
        str = {msg:"Không có ứng suất nhiệt", kc:"Mang một số quần áo ấm, găng tay, mũ"};
        break;
      default:
        str={}
        break;
    }

    return str
  }

  return (
    <View style={styles.container}>
      <View style={{flex: 6}}>
        <View>
          <Text style={styles.heading}>{time}</Text>
        </View>
        <View>
          <Text style={styles.subheading}>{date} </Text>
        </View>

        {loading ? (
        <View style={styles.weatherItemContainer}>
          <Loading />
        </View>
        ) : (
        <View style={styles.weatherItemContainer}>
              <WeatherItem
                  title="Nhiệt độ"
                  value={data.current ? data.current.temp_c : ""}
                  unit=" °C"
              />
          <View style={{marginLeft: 5, flexDirection:'row',alignItems: 'right', justifyContent: "right", textAlign: "right"}}>
            <Image
              source={{
               // uri: 'https://cdn.weatherapi.com/weather/64x64/night/296.png',
                uri: `https:${data?.current?.condition?.icon || ''}`,
              }}
              style={{ width: 30, height: 30 }}

          />
            <Text style={[styles.subheading,{ textAlign: "right", marginRight: 30}]}>
              {data.current && data.current.condition && data.current.condition.text? data.current.condition.text : ""
              }
            </Text>
          </View>
              </View>
          )}



        <View style={styles.weatherItemContainer}>
          <WeatherItem
            title="Độ ẩm"
            value={data.current ? data.current.humidity : ""}
            unit="%"
          />
          <WeatherItem
            title="Gió"
            value={data.current ? data.current.wind_kph : ""}
            unit=" kph"
          />
          <WeatherItem
            title="Tia UV"
            value={data.current ? data.current.uv : ""}
            unit=""
          />

        </View>
      </View>

        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",

                backgroundColor:"rgba(0,0,0, 0.60)",
                marginTop: 22,
                width: Dimensions.get('window').width
            }}>
                <View style={{
                    margin: 10,  width:Dimensions.get('window').width - 20,
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
                    <View style={{ flexDirection: "row", display: "flex" ,padding: 20, alignContent:'center'}}>
                        <MaterialCommunityIcons
                            name="information-outline"
                            color={"red"}
                            size={25}

                        />
                        <Text style={{ color: "black", fontSize:20, marginLeft: 5 }}>UTCI - Chỉ số gánh nặng nhiệt  </Text>

                    </View>
<Text style={{
    backgroundColor: "white",
    borderWidth: 2,
    margin: 10,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: "green",
    marginBottom: 20,
    //width: Dimensions.get('window').width
}}>{UctiMeaning}</Text>
                    <Pressable
                        style={{
                            borderWidth: 1,
                            borderColor: "blue",
                            padding: 10,
                            backgroundColor: "green",
                            marginBottom: 20
                        }}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={{ color: "white" }}>Close </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
      <View style={styles.rightAlign}>

          <View style={{marginTop: -0, flexDirection: "row", display: "flex" ,padding: 0, alignContent:'center'}}>
              <MaterialCommunityIcons
                  name="map-marker"
                  color={"green"}
                  size={20}
              />
              <Text style={{ color: "black", fontSize:15, marginLeft: 5 }}>{data.location ? data.location.name : ""} </Text>

          </View>
        <TouchableOpacity
            style={{
              marginRight: -20
              //flexDirection: "row",
              //display: "flex",
              //justifyContent: "space-between",
              //height:Dimensions.get('window').height/12,
             // width:Dimensions.get('window').width/6,
            }}
            onPress={() => {
                setModalVisible(!modalVisible);
            }}
        >

          <Text style={{
            fontSize: 14,
            color: "#ffffff",
            fontWeight: 'thin'
          }}>Chỉ số nhiệt tổng hợp</Text>
          <View style={{flexDirection:'row', width:120}}>
              <Text style={{
                fontSize: 35,
                color: "#058541",
                marginRight:10
              }}>UTCI </Text>
              <MaterialCommunityIcons
                  name="help-circle-outline"
                  color={"#317324"}
                  size={18}
                  style={{
                    //backgroundColor: '#000000',
                    marginLeft: -12,
                    marginTop: 10
                  }}
              />
              </View>
        </TouchableOpacity>

        <Text style={styles.latlong}>
         {uIndex.toFixed(2)} °C
        </Text>

        <Text style={[styles.latlong,{ textAlign: "right", marginTop: -5}]}>
          {UCTIStr}
        </Text>
        <Text style={{
          fontSize: 20,
          color: "white",
          fontWeight: "250"
        }}>
         {uIndexStr.msg}
        </Text>
       
      </View>

    </View>
  );
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
    marginLeft:10
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
    fontSize: 30,
    color: "#058541"
  },
  latlong: {
    fontSize: 20,
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
    justifyContent: "space-between"
  },
  weatherItemTitle: {
    color: "#eee",
    fontSize: 20,
    fontWeight: "100"
  }
});

export default DateTime;
