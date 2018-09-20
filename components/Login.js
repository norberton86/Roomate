import React from 'react';
import { StyleSheet, Text, View ,ImageBackground,Image, ActivityIndicator,KeyboardAvoidingView,AsyncStorage,Alert,TouchableOpacity} from 'react-native';
import { Akira} from 'react-native-textinput-effects';
import Button from 'react-native-button';
import DismissKeyBoard from './DismissKeyBoard'
import {validateEmail}  from '../utils/validations'
import {urlBase}  from '../utils/constant'
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class Login extends React.Component {

  static navigationOptions = ({navigation}) => { return { headerTransparent: true, headerStyle: { borderBottomWidth: 0, } } }

  constructor(props) {
    super(props);
    this.state={
      requesting:false,
      email:'',
      pass:''
    }
   
  }

  login(){

    const {email,pass} = this.state

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
    else if(pass=='')
    Alert.alert('Pass is required')
    else
    this.connectAndNavigate(email.toLowerCase(),pass.toLowerCase())
  };


  connectAndNavigate(email,pass)
  {
    this.setState({requesting:true})

    fetch(urlBase+"/login/"+email+'/'+pass)
    .then ( response => response.json() )
    .then( response => { 

      this.setState({requesting:false})

      if(response.status=="invalid")
      {
        Alert.alert("Invalid Credentials")
      }
      else
      {
        AsyncStorage.setItem('email', email.toLowerCase()).then(res=>{

          AsyncStorage.setItem('userToken', response.token).then(res=>{
            this.props.navigation.navigate('App');
          }).catch(error=>{
      
          })
          
        }).catch(error=>{
    
        })
      }

    })
    .catch ( err => {
      this.setState({requesting:false})
      Alert.alert('Error trying to connect with server')
    })

  }

  render() {
    
    const {requesting,email,pass} = this.state

    return (
      <DismissKeyBoard>
          <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.background}>
           
                <View style={styles.container}>
                    <Image source={require('../img/syntelLogo.png')} style={styles.syntelLogo}/>
                


                <Akira
                    style={styles.input}
                    label={'E-Mail'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                    onChangeText={(text) =>  this.setState({email: text}) }
                    value={email}
                />

                   

                   
                <Akira
                    style={styles.input}
                    label={'Pass'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                    onChangeText={(text) =>  this.setState({pass: text}) }
                    value={pass}
                    secureTextEntry={true}
                />

                    {!requesting?
                        <Button
                        containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#114937',width:150}}
                        disabledContainerStyle={{backgroundColor: 'grey'}}
                        style={{fontSize: 20, color: 'white'}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this.login()}>
                        LOGIN
                        </Button>
                        :
                        <ActivityIndicator size="large" color="#114937" />
                    }

                    {!requesting?
                    <View style={styles.options}> 
                      <TouchableOpacity activeOpacity = { .5 } onPress={() => this.props.navigation.push('SignUp')}>
                        <Text style={styles.textOptions}  >Sign Up</Text>
                      </TouchableOpacity>

                      <TouchableOpacity activeOpacity = { .5 } onPress={() => this.props.navigation.push('Forgot')}>
                        <Text style={styles.textOptions} >Forgot Pass</Text>
                      </TouchableOpacity>  

                    </View>
                    :
                    null
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
        alignItems: "center",
        paddingLeft:25,
        paddingRight:25,
    },
    syntelLogo:{
        width:'60%',
        height:'30%',
    },
    input:{
      width:'100%',
        marginBottom:15,
        marginTop:0,

    },
    options:{
        width:'100%',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop:18,
        paddingLeft:25,
        paddingRight:25
    },
    textOptions:{
      color:"#114937",
      fontSize:18,
      fontWeight:  'bold'
    }
});