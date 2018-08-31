import React from 'react';
import { StyleSheet, Text, View ,ImageBackground, ActivityIndicator,KeyboardAvoidingView,Image} from 'react-native';
import { Akira } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import DismissKeyBoard from './DismissKeyBoard'
import RNPickerSelect from 'react-native-picker-select';

export default class SignUp extends React.Component {

  static navigationOptions = ({navigation}) => { return { headerTransparent: true, headerStyle: { borderBottomWidth: 0, } } }

  constructor(props) {
    super(props);
    this.state={
      requesting:false,
      email:'',
      pass:'',
      state: 'null',
      states: [
                {
                    label: 'Red',
                    value: 'red',
                },
                {
                    label: 'Orange',
                    value: 'orange',
                },
                {
                    label: 'Blue',
                    value: 'blue',
                },
      ]
    }
   
  }

  signUp() {
    this.setState({requesting:true})
    this.props.navigation.goBack()
  }



  render() {
    
    const {requesting} = this.state

    return (
    <DismissKeyBoard>
        <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.background}>
            <KeyboardAvoidingView  behavior="padding" enabled>
                
           
                <View style={styles.container}>
            
                {/*<Image source={require('../img/syntelLogo.png')} style={styles.syntelLogo}/>*/}

                <Akira
                    style={styles.input}
                    label={'E-Mail'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                />

                <Akira
                    style={styles.input}
                    label={'Full Name'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                />

                <Akira
                    style={styles.input}
                    label={'Pass'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                />


                <Akira
                    style={styles.input}
                    label={'Phone'}
                    borderColor={'#114937'}
                    labelStyle={{ color: '#114937' }}
                />

                 <RNPickerSelect
                    placeholder={{
                        label: 'Select a State...',
                        value: null,
                    }}
                    items={this.state.states}
                    onValueChange={(value) => {
                        this.setState({
                            state: value,
                        });
                    }}
                  
                    style={{ ...pickerSelectStyles }}
                    value={this.state.state}
                    
                />

                 <RNPickerSelect
                    placeholder={{
                        label: 'Select a City...',
                        value: null,
                    }}
                    items={this.state.states}
                    onValueChange={(value) => {
                        this.setState({
                            state: value,
                        });
                    }}
                  
                    style={{ ...pickerSelectStyles }}
                    value={this.state.state}
                    
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
            </KeyboardAvoidingView>
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
        fontSize: 16,
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
        fontSize: 16,
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