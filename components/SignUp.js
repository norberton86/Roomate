import React from 'react';
import { StyleSheet, View ,ImageBackground, ActivityIndicator,KeyboardAvoidingView,Alert,ScrollView} from 'react-native';
import { Akira } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import DismissKeyBoard from './DismissKeyBoard'
import RNPickerSelect from 'react-native-picker-select';
import {getStatesFormated,getCitiesByState} from '../utils/data'
import {validateEmail,isPhoneNumber}  from '../utils/validations'
import {urlBase}  from '../utils/constant'

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class SignUp extends React.Component {

  static navigationOptions = ({navigation}) => { return { headerTransparent: true, headerStyle: { borderBottomWidth: 0, } } }

  constructor(props) {
    super(props);
    this.state={
      requesting:false,
      
      email:'',
      fullName:'',
      pass:'',
      phone:'',

      state: 'null',
      states: getStatesFormated(),
      city:'null',
      cities:[]
    }
   
  }

  signUp() {

    const {email,fullName,pass,phone,state,city} = this.state

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
    else if(fullName=='')
        Alert.alert('Full Name is required')
    else if(pass=='')
        Alert.alert('Pass is required')
    else if(phone=='')
      Alert.alert('Phone is required')
    else if(!isPhoneNumber(phone))
    {
      Alert.alert('Incorrect phone format')
    }
    else if(state==null)
    {
        Alert.alert('State is required')
    }
    else if(city==null)
    {
        Alert.alert('City is required')
    }
    else
    {
        var params = {
            email: email.toLowerCase(),
            fullName: fullName.toLowerCase(),
            pass: pass.toLowerCase(),
            phone:phone.toLowerCase(),
            state:state,
            city:city
        };

        this.connectAndBacK(params)
    }
    

  }

  connectAndBacK(params){

 
    
    var request = {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(params)
    };
    
    this.setState({requesting:true})

    fetch(urlBase+"/singUp", request).then ( response => response.json() )
    .then( response => { 

      this.setState({requesting:false})
      if(response.status=="duplicate")
      {
        Alert.alert("This email already exists")
      }
      else
      this.props.navigation.goBack()
    })
    .catch ( err => {
      this.setState({requesting:false})
      Alert.alert('Error trying to connect with server')
    })
     
  }

  render() {
    
    const {requesting,email,fullName,pass,phone} = this.state

    return (
    <DismissKeyBoard>
        <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.background}>
           
                
              <ScrollView>
                <View style={styles.container}>
            

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
                    label={'Full Name'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                    onChangeText={(text) =>  this.setState({fullName: text}) }
                    value={fullName}
                />

                <Akira
                    style={styles.input}
                    label={'Pass'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                    onChangeText={(text) =>  this.setState({pass: text}) }
                    value={pass}
                />


                <Akira
                    style={styles.input}
                    label={'Phone'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                    onChangeText={(text) =>  this.setState({phone: text}) }
                    value={phone}
                />

                 <RNPickerSelect
                    placeholder={{
                        label: 'Select a State...',
                        value: null,
                    }}
                    items={this.state.states}
                    onValueChange={(value) => {
                        this.setState({state: value,cities:getCitiesByState(value)});

                    }}
                  
                    style={{ ...pickerSelectStyles }}
                    value={this.state.state}
                    
                />

                 <RNPickerSelect
                    placeholder={{
                        label: 'Select a City...',
                        value: null,
                    }}
                    items={this.state.cities}
                    onValueChange={(value) => {
                        this.setState({
                            city: value,
                        });
                    }}
                  
                    style={{ ...pickerSelectStyles }}
                    value={this.state.city}
                    
                />

                {!requesting?
                    <Button
                    containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#114937',width:150}}
                    disabledContainerStyle={{backgroundColor: 'grey'}}
                    style={{fontSize: 20, color: 'white'}}
                    styleDisabled={{color: 'red'}}
                    onPress={() => this.signUp()}>
                    SIGN UP
                    </Button>
                    :
                    <ActivityIndicator size="large" color="#114937" />
                }

                </View>
                </ScrollView>
           
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
        paddingTop:30
    },
    input:{
        width:'100%',
        marginBottom:15,
    },
    syntelLogo:{
        width:'60%',
        height:'10%',
        marginBottom:0
    },
   
  });

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
       // fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: '#114937',
        borderRadius: 4,
        backgroundColor: 'white',
        color: '#114937',
        marginBottom:15
    },
    inputAndroid:{
        //fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: '#114937',
        borderRadius: 4,
        backgroundColor: 'white',
        color: '#114937',
        marginBottom:15
    }
});