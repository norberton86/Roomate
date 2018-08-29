import React from 'react';
import { StyleSheet, Text, View ,ImageBackground, ActivityIndicator,KeyboardAvoidingView,Image,TouchableOpacity} from 'react-native';
import { Akira } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import DismissKeyBoard from './DismissKeyBoard'
import Carrousel from './Carrousel'
import RNPickerSelect from 'react-native-picker-select';
var ImagePicker = require('react-native-image-picker');

export default class Profile extends React.Component {


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
      ],
      images:[],
      selectedIndex:null
    }
   

  }

  Update() {
    this.setState({requesting:true})
  }

  showPicker () {

    ImagePicker.showImagePicker(options, (response) => {
      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
                this.setState(prevState => ({
                    images: [...prevState.images, {uri:response.uri,data:'data:image/jpeg;base64,' + response.data}]
                })) 
        }
      });
  }

  changeHandler(index){
      this.setState({selectedIndex:index})
  }
  
  removeImage()
  {
    var array = [...this.state.images]; // make a separate copy of the array
    array.splice(this.state.selectedIndex, 1);
    this.setState({images: array});
  }

  render() {
    
    const {requesting,images} = this.state

    return (
    <DismissKeyBoard>
        <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.background}>
            <KeyboardAvoidingView  behavior="padding" enabled>
                
           
                <View style={styles.container}>


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

                {images.length>0?
                                <View style={styles.operations}>
                                                <TouchableOpacity activeOpacity = { .5 } onPress={()=>this.showPicker()}>
                                                    <Image source={require('../img/add_green.png')} style={styles.operation} />
                                                </TouchableOpacity>
                                                
                                                <TouchableOpacity activeOpacity = { .5 } onPress={()=>this.removeImage()}>
                                                    <Image source={require('../img/close_red.png')} style={styles.operation}/> 
                                                </TouchableOpacity>            
                                </View>
                                :
                                <TouchableOpacity activeOpacity = { .5 } onPress={()=>this.showPicker()} style={styles.operations}>
                                    <Image  source={require('../img/add_image.png')} style={styles.addImage}/>    
                                </TouchableOpacity>      
                }

                {images.length>0? 
                                <Carrousel images={images} onChange={this.changeHandler.bind(this)} />
                                :
                                null
                }

                {!requesting?
                    <Button
                    containerStyle={styles.button}
                    disabledContainerStyle={{backgroundColor: 'grey'}}
                    style={{fontSize: 20, color: 'white'}}
                    styleDisabled={{color: 'red'}}
                    onPress={() => this.Update()}>
                    UPDATE
                    </Button>
                    :
                    <ActivityIndicator size="large" color="#114937" style={{marginTop:15}} />
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
     
    },
    container:{
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        paddingLeft:25,
        paddingRight:25,
        paddingTop:15
    },
    input:{
        width:'100%',
        marginBottom:15,
    },
    operation:{
        width:55,
        height:55,
       marginRight:10
    },
    operations:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:15
    },
    addImage:{
        width:150,
        height:150
    },
    button:{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#114937',width:150,marginTop:15}
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

var options = {
    title: 'Select Image',
    
  };