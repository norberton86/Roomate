import React from 'react';
import { StyleSheet, Text, Switch,View ,ImageBackground, ActivityIndicator,KeyboardAvoidingView,Image,TouchableOpacity,AsyncStorage,Alert} from 'react-native';
import { Akira } from 'react-native-textinput-effects';
import Button from 'react-native-button';
import DismissKeyBoard from './DismissKeyBoard'
import Carrousel from './Carrousel'
import RNPickerSelect from 'react-native-picker-select';
var ImagePicker = require('react-native-image-picker');
import {getStatesFormated,getCitiesByState} from '../utils/data'
import {isPhoneNumber,UUID}  from '../utils/validations'
import {urlBase}  from '../utils/constant'

import FirebaseClient from '../utils/FirebaseClient'

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      requesting:false,

      phone:'',
      state: 'null',
      states: getStatesFormated(),
      city:'null',
      cities:[],

      images:[],
      selectedIndex:null,
      accountActive : null

    }
   
  }

  componentDidMount(){
      this.getInfo()
  }

  LogOut(){
    AsyncStorage.clear().then(res=>{
        this.props.navigation.navigate('Auth');
    }).catch(err=>{

    })
  }

  getInfo()
  {
    AsyncStorage.getItem('email')
    .then(email=>{

        AsyncStorage.getItem('userToken')
        .then(token=>{
    
            const config = {

                headers: {
 
                  'Authorization': 'Bearer ' + token
                },
            };

            this.setState({requesting:true})
            fetch(urlBase+"/api/info/"+email, config)
            .then( response => response.json() )
            .then(responseData => {
                this.setState({requesting:false})

                if(responseData.status=='success')
                {
                   this.setState({
                       phone:responseData.data.phone,
                       state:responseData.data.state,
                       city:responseData.data.city,
                       images:responseData.data.images,
                       accountActive:responseData.data.accountActive,
                       selectedIndex:responseData.data.images.length==0?null:0
                   })
                }

            })
            .catch(err => {
                this.setState({requesting:false})
                Alert.alert('Error trying to connect with server')
            });
    
        })
        .catch(err=>{})

    })
    .catch(err=>{})
  }

  Update(){

    const {phone,state,city} = this.state

    if(phone=='')
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
        AsyncStorage.getItem('email').then(email=>{
            AsyncStorage.getItem('userToken')
            .then(token=>{
        
                this.setState({requesting:true})
        
                fetch(urlBase+"/api/updateInfo/"+phone+"/"+state+"/"+city+"/"+email,{
                    headers:{
                        'Authorization': 'Bearer '+token,
                    },
                })
                .then( response => response.json() )
                .then( response => { 
        
                this.setState({requesting:false})
                if(response.status!="success")
                {
                    Alert.alert("Some error occurs trying to update")
                }
                
                })
                .catch ( err => {
                    this.setState({requesting:false})
                    Alert.alert('Error trying to connect with server')
                })
            })
            .catch(err=>{})
        }).catch(err=>{

        })

    }
    
  };

  Activate(){

    AsyncStorage.getItem('email').then(email=>{

        AsyncStorage.getItem('userToken')
        .then(token=>{
    
            this.setState({requesting:true})
    
            fetch(urlBase+"/api/activate/"+!this.state.accountActive+"/"+email,{
                headers:{
                    'Authorization': 'Bearer '+token,
                },
            })
            .then( response => response.json() )
            .then( response => { 
    
            this.setState({requesting:false})
            if(response.status!="success")
            {
                Alert.alert("Some error occurs trying to update")
            }
            else
            this.setState({accountActive:!this.state.accountActive})
            
            })
            .catch ( err => {
                this.setState({requesting:false})
                Alert.alert('Error trying to connect with server')
            })
        })
        .catch(err=>{})

    }).catch(err=>{})

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
             
              //this.UploadImage(response)
              this.UploadImageFirebase(response)
        }
      });
  }

  UploadImage(image){

    var data = new FormData();

    var parts=image.fileName.split('.')

    data.append('avatar', {
      uri: image.uri,
      name: image.fileName,
      type: 'image/'+parts[parts.length-1].toLowerCase()
    });


    AsyncStorage.getItem('email')
    .then(email=>{

        AsyncStorage.getItem('userToken')
        .then(token=>{
    
            const config = {
                method: 'POST',
                headers: {
                  'Content-Type': 'multipart/form-data;',
                  'Authorization': 'Bearer ' + token
                },
                body: data
            };
    
            var finalName=email+"-"+UUID()+"."+parts[parts.length-1].toLowerCase()

            this.setState({requesting:true})
            fetch(urlBase+"/api/uploadImage/"+finalName, config)
            .then( response => response.json() )
            .then(responseData => {
                this.setState({requesting:false})

                if(responseData.status=='success')
                {
                    this.setState(prevState => ({
                        images: [...prevState.images, {uri:urlBase+"/"+finalName}]
                    })) 
                }

            })
            .catch(err => {
                this.setState({requesting:false})
                Alert.alert('Error trying to connect with server')
            });
    
        })
        .catch(err=>{})

    })
    .catch(err=>{})

  }

  UploadImageFirebase(image) {

    AsyncStorage.getItem('userToken')
    .then(token=>{

        AsyncStorage.getItem('email')
        .then(email=>{
    
            var parts=image.fileName.split('.')
            var finalName=email+"-"+UUID()+"."+parts[parts.length-1].toLowerCase()
      
            this.setState({requesting:true})
            fetch(image.uri).then(response=>{
    
                response.blob().then(blob=>{
                    
                    var imageRef = FirebaseClient.storage().ref('images').child(finalName)
                    imageRef.put(blob).then(result=>{
    
                        imageRef.getDownloadURL().then(url=>{
    
                            const config = {
                                method: 'POST',
                                headers: {
                                  'Authorization': 'Bearer ' + token,
                                  'Content-Type':'application/json'
                                },
                                body: JSON.stringify({
                                    'url':url,
                                    'finalName':finalName
                                })
                            };
                
                            fetch(urlBase+"/api/uploadImage", config)
                            .then( response => response.json() )
                            .then(responseData => {
    
                                this.setState(prevState => ({
                                    images: [...prevState.images, {uri:url,name:finalName}],
                                    requesting:false
                                })) 
                
                            })
                            .catch(err => {
                                this.setState({requesting:false})
                                Alert.alert('Error trying to connect with server')
                            });
                            
                        }).catch(err=>{
                            this.setState({requesting:false})}
                        )
    
                    }).catch(err=>{this.setState({requesting:false})})
    
                }).catch(err=>{this.setState({requesting:false})})
    
            }).catch(err=>{this.setState({requesting:false})})
            
        }).then(err=>{})

    }).catch(err=>{})

  }

  changeHandler(index){
      this.setState({selectedIndex:index})
  }
  
  removeImage()
  {

    AsyncStorage.getItem('userToken')
    .then(token=>{

        this.setState({requesting:true})

        const {selectedIndex,images}=this.state
        fetch(urlBase+"/api/removeImage/"+images[selectedIndex].uri.split(urlBase+"/")[1],{
            headers:{
                'Authorization': 'Bearer '+token,
            },
        })
        .then( response => response.json() )
        .then( response => { 

            this.setState({requesting:false})
            if(response.status=="success")
            {
                var array = [...this.state.images]; // make a separate copy of the array
                array.splice(this.state.selectedIndex, 1);
                this.setState({images: array});
            }

        })
        .catch ( err => {
            this.setState({requesting:false})
            Alert.alert('Error trying to connect with server')
        })
    })
    .catch(err=>{})

  }

  removeImageFirebase(){

    AsyncStorage.getItem('userToken')
    .then(token=>{

        const {selectedIndex,images}=this.state

        this.setState({requesting:true})
        FirebaseClient.storage().ref('images').child(images[selectedIndex].name).delete().then(()=> {
    
            fetch(urlBase+"/api/removeImage/"+images[selectedIndex].name,{
                headers:{
                    'Authorization': 'Bearer '+token,
                },
            })
            .then( response => response.json() )
            .then( response => { 
    
                this.setState({requesting:false})
                if(response.status=="success")
                {
                    var array = [...this.state.images]; // make a separate copy of the array
                    array.splice(this.state.selectedIndex, 1);
                    this.setState({images: array});
                }
    
            })
            .catch ( err => {
                this.setState({requesting:false})
                Alert.alert('Error trying to connect with server')
            })
    
        }).catch(error=> {
            this.setState({requesting:false})
            console.log(error)
        });

    }).catch(err=>{})

  }

  render() {
    
    const {requesting,images,phone,state,city} = this.state

    return (
    <DismissKeyBoard>
        <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.background}>
            <KeyboardAvoidingView  behavior="padding" enabled>
                
           
                <View style={styles.container}>

                <Text style={styles.statusSwicth}> 
                    {
                        this.state.accountActive? 'Account is active' :'Account unactive'
                    }
                </Text>

                <Switch
                onValueChange={(value) =>{ 
                    
                    this.Activate()
                }}
                style={{marginBottom: 10}}
                value={this.state.accountActive?true:false} />

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
                    value={state}
                    
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
                    value={city}
                    
                />

                {images.length>0?
                                <View style={styles.operations}>
                                                <TouchableOpacity activeOpacity = { .5 } onPress={()=>this.showPicker()}>
                                                    <Image source={require('../img/add_green.png')} style={styles.operation} />
                                                </TouchableOpacity>
                                                
                                                <TouchableOpacity activeOpacity = { .5 } onPress={()=>this.removeImageFirebase()}>
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
                    <View style={styles.buttons}>
                        <Button
                        containerStyle={styles.button}
                        disabledContainerStyle={{backgroundColor: 'grey'}}
                        style={{fontSize: 20, color: 'white'}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this.Update()}>
                        UPDATE
                        </Button>

                        <Button
                        containerStyle={styles.buttonLogout}
                        disabledContainerStyle={{backgroundColor: 'grey'}}
                        style={{fontSize: 20, color: 'white'}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this.LogOut()}>
                        LOGOUT
                        </Button>

                    </View>
                   
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
    buttons:{
        width:'100%',
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    button:{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#114937',width:150,marginTop:15},
    buttonLogout:{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#406c60',width:150,marginTop:15},
    statusSwicth:{fontSize: 18,color:'#114937', fontWeight:  'bold'}
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
    }
});

var options = {
    title: 'Select Image',
    
};