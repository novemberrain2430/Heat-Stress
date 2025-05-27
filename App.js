import * as React from 'react';
import  { useEffect, useRef, useState, Fragment } from "react";
import {
    Alert,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    ActivityIndicator,
    Keyboard,
    AppState, Image,
} from "react-native";
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import DateTime from "./DateTime";
import {DetailsScreen} from "./DetailsScreen";
import * as SplashScreen from 'expo-splash-screen';



import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {MaterialCommunityIcons} from "@expo/vector-icons";




// ... other code from the previous section

export function HomeScreen() {
    const navigation = useNavigation();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 // const { handleLogin } = useAuth();
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState('abc@123');


  return (
      <SafeAreaView style={{
        backgroundColor: "rgba(0,0,0, 0.150)",
        flex: 1,
        marginTop:50
      //  justifyContent: "flex-start",
      }}>
  <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset="0"

      enabled
      style={{ flex: 1 }}
  >
    <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
    >

      <View style={styles.container}>
        <Image    source={require('./assets/login.png')}
                  style={[{height:Dimensions.get('window').height/4,
                    width:Dimensions.get('window').width, overflow:'hidden', flex:1}]}/>
        <View  style={{ flexDirection: "column", flex: 2, display:"none" }}>
          <Text
              style={{
                color: "black",
                justifyContent: "center",
                alignSelf: "center",
                fontSize: 30,
                fontWeight: "bold",
                marginTop: 50,
                fontFamily: "Roboto",
              }}
          >
            {" "}
            WISS{" "}
          </Text>
          <Text
              style={{
                color: "black",
                justifyContent: "center",
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "normal",
                marginTop: 10,
              }}
          >
            {" "}
            Account Sign In
          </Text>
        </View>
        <View
            style={{
              flexDirection: "column",
              flex: 9,
              marginLeft: 30,
              marginRight: 30,
              marginTop:50
            }}
        >

          <TextInput
              style={[styles.textInput]}
              keyboardType={"default"}
              placeholder={'User name'}
              placeholderTextColor={"grey"}
              returnKeyType="next"
              value={email}
              //ref={ref_input2_moldal}
              onChangeText={(text) => {
                setEmail(text);
              }}
              onSubmitEditing={(event) => {
                //ref_input2_moldal.current.focus();
              }}
          />

          <TextInput
              style={[styles.textInput, {}]}
              secureTextEntry={true}
              //keyboardType={"default"}
              placeholder={'Password'}

              //placeholderTextColor={"grey"}
              value={password}
              returnKeyType="done"
              onChangeText={(text) => setPassword(text)}
              //ref={ref_input2_moldal}
              onSubmitEditing={(event) => {
                //ref_input3_moldal.current.focus();
              }}
          />
          <Text style={[styles.label, {}]}> {error}</Text>
          <View
              style={{
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "row",
              }}
          >
            {loading ? (
                <View
                    style={{
                      paddingVertical: 20,
                    }}
                >
                  <ActivityIndicator animating size="large" color={"orange"} />
                </View>
            ) : (
                <Button
                    style={{ color: "orange", borderRadius: 20 }}
                    title="Sign In"
                    onPress={() =>
                    {
                      if(email ==='admin' && password ==='abc@123'){
                        setLoading(true)
                        setTimeout(() => {
                          setLoading(false)
                          navigation.navigate('Details')
                        }, 2000)
                      }else alert('sai user / password')
                   }}
                />
            )}
          </View>
        </View>
      </View>

    </ScrollView>
  </KeyboardAvoidingView>

       </SafeAreaView>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Details',
  screens: {
    Home: {screen: HomeScreen,
      options: {
      headerShown: false
      }
    },
    Details: {screen: DetailsScreen,
      options:  ({ route, navigation }) => ( {
          title: 'QUÂN Y VIỆT NAM',
          titleColor:'#135427',
          headerBackButtonMenuEnabled:false,
          headerBackVisible: false,
          headerShown: true,
          headerRight: () => (
              <TouchableOpacity
                  style={{
                      flexDirection: "row",
                      display: "flex",
                      justifyContent: "space-between",
                      height:Dimensions.get('window').height/12,
                      width:Dimensions.get('window').width/6,
                  }}
                  onPress={() => {

                  }}
              >
                  <Image    source={require('./assets/topbaricon.png')}
                            style={[{
                                //height:60,
                                //width:60,
                                height:Dimensions.get('window').height/12,
                                width:Dimensions.get('window').width/6,
                                overflow:'hidden', flex:1}]}/>
              </TouchableOpacity>


          ),
      })
    }
  },
  
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);
    SplashScreen.preventAutoHideAsync();

    useEffect(() => {

        async function prepare() {
            try {
                // Simulate a delay (e.g., for loading resources or API calls)
                await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second timeout
            } catch (e) {
                console.warn(e);
            } finally {
                // Mark the app as ready
                setAppIsReady(true);
                // Hide the splash screen
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    if (!appIsReady) {
        return null; // Render nothing until the app is ready
    }


  return <Navigation />;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor:"#FFFFFF",
    //backgroundColor: "rgba(255,255,255,0.6)",
    flex: 1,
    justifyContent: "flex-start",
    display: "flex",
  },
  textInput: {
    fontSize: 20,
    color: "black",
    margin: 5,
    padding: 5,
    width: "90%",
    alignSelf: "center",
    alignContent: "center",
    textAlign: "center",

    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: "green",
  },
  icon: { marginRight: 7, marginLeft: 7 },
  touchableOpacity: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "green",
    marginBottom: 20,
  },
  label: {
    margin: 5,
    padding: 5,
    color: "black",
    alignSelf: "flex-start",
    fontWeight: "normal",
    fontSize: 16,
    alignItems: "center",
    alignContent: "center",
  },
});
