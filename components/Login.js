import React from 'react';
import { StyleSheet, Text, View ,ImageBackground,Image, ActivityIndicator,KeyboardAvoidingView} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Hideo } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import DismissKeyBoard from './DismissKeyBoard'

export default class Login extends React.Component {


  constructor(props) {
    super(props);
    this.state={
      requesting:false,
      email:'',
      pass:''
    }
   
  }

  login() {
    this.setState({requesting:true})
  }

  SignUp(){
  
  }

  Forgot(){

  }

  render() {
    
    const {requesting} = this.state

    return (
      <DismissKeyBoard>
          <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.background}>
         
                <View style={styles.container}>
                    <Image source={require('../img/syntelLogo.png')} style={styles.syntelLogo}/>
                
                    <Hideo
                    style={styles.input}
                    iconClass={FontAwesomeIcon}
                    iconName={'envelope'}
                    iconColor={'white'}
                    iconBackgroundColor={'#114937'}
                    inputStyle={{ color: '#464949' }}
                  
                  />

                    <Hideo
                    style={styles.input}
                    iconClass={FontAwesomeIcon}
                    iconName={'key'}
                    iconColor={'white'}
                    iconBackgroundColor={'#114937'}
                    inputStyle={{ color: '#464949' }}
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
                  
                        <Text style={styles.textOptions} onPress={() => this.SignUp()}>Sign Up</Text>
                      

                        <Text style={styles.textOptions} onPress={() => this.Forgot()}>Forgot Pass</Text>
                    
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