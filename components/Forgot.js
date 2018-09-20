import React from 'react';
import { StyleSheet, Text, View ,ImageBackground,Image, ActivityIndicator,KeyboardAvoidingView,Alert} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hideo } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import DismissKeyBoard from './DismissKeyBoard'
import {validateEmail}  from '../utils/validations'
import {urlBase}  from '../utils/constant'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class Forgot extends React.Component {

  static navigationOptions = ({navigation}) => { return { headerTransparent: true, headerStyle: { borderBottomWidth: 0, } } }

  constructor(props) {
    super(props);
    this.state={
      requesting:false,
      email:''
    }
   
  }

  Request(){
    const {email} = this.state

    if(email=='')
      Alert.alert('Email is required')
    else if(!validateEmail(email))
    {
      Alert.alert('Incorrect email format')
    }
    else if(email.split('@')[1]!='syntel.com')
    {
      Alert.alert('Please use a Syntel email acccount')
    }
    else
    this.connectAndBacK(email.toLowerCase())
  }

  connectAndBacK(email){

    this.setState({requesting:true})

    fetch(urlBase+"/recover/"+email)
    .then( response => response.json() )
    .then( response => { 

      this.setState({requesting:false})
      if(response.status=="success")
      {
        Alert.alert("Please check your email")
        this.props.navigation.goBack()
      }
      else{
        Alert.alert("This email is doesn't exist")
      }
      
    })
    .catch ( err => {
      this.setState({requesting:false})
      Alert.alert('Error trying to connect with server')
    })
   
  }

  render() {
    
    const {requesting,email} = this.state

    return (
      <DismissKeyBoard>
          <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.background}>
         
                <View style={styles.container}>
                    <Image source={require('../img/syntelLogo.png')} style={styles.syntelLogo}/>

                    <Text style={styles.textOptions}> Insert your email to send you a new password </Text>
                
                    <Hideo
                    style={styles.input}
                    iconClass={FontAwesomeIcon}
                    iconName={'envelope'}
                    iconColor={'white'}
                    iconBackgroundColor={'#114937'}
                    inputStyle={{ color: '#464949' }}
                    onChangeText={(text) =>  this.setState({email: text}) }
                    value={email}
                  />


                    {!requesting?
                        <Button
                        containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#114937',width:150}}
                        disabledContainerStyle={{backgroundColor: 'grey'}}
                        style={{fontSize: 20, color: 'white'}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this.Request()}>
                        REQUEST
                        </Button>
                        :
                        <ActivityIndicator size="large" color="#114937" />
                    }


                </View>
  
               

        </ImageBackground>
      </DismissKeyBoard>
      
    );
  }
}

var styles = StyleSheet.create({
    background: {
      flex:1,
      flexDirection: 'column',
      justifyContent: "center",
    },
    container:{
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
    syntelLogo:{
        width:'60%',
        height:'35%',
    },
    input:{
        marginLeft:25,
        marginRight:25
    },

    textOptions:{
      color:"#114937",
      fontSize:16,
      fontWeight:  'bold',
      marginBottom:5
    }
  });