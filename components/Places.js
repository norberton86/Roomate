import React from 'react';
import { StyleSheet, View ,ImageBackground, ActivityIndicator,Image,FlatList,AsyncStorage,Text,TouchableOpacity,Alert} from 'react-native';
import Carrousel from './Carrousel'
import RNPickerSelect from 'react-native-picker-select';
import {urlBase}  from '../utils/constant'
import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-cards';
import Communications from 'react-native-communications';
import {getStatesFormated,getCitiesByState} from '../utils/data'
import Modal from "react-native-modal";

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      
        requesting:false,
        state: 'null',
        states: getStatesFormated(),
        city:'null',
        cities:[],
        data:[],
        images:[],
        isModalVisible:false
    }
  }

  filterPlaces()
  {
    AsyncStorage.getItem('userToken')
    .then(token=>{

        const {state,city}=this.state
        this.setState({requesting:true})

        fetch(urlBase+"/api/filter/"+state+"/"+city,{
            headers:{
                'Authorization': 'Bearer '+token,
            },
        })
        .then( response => response.json() )
        .then( response => { 

        this.setState({requesting:false})
        if(response.status=="success")
        {
            this.setState({data:response.data})
        }
        
        })
        .catch ( err => {
            this.setState({requesting:false})
            Alert.alert('Error trying to connect with server')
        })
    })
    .catch(err=>{})
  }

  showImages(email)
  {
        this.setState({images:[]})

        AsyncStorage.getItem('userToken')
        .then(token=>{
    
            
            this.setState({requesting:true})
    
            fetch(urlBase+"/api/images/"+email,{
                headers:{
                    'Authorization': 'Bearer '+token,
                },
            })
            .then( response => response.json() )
            .then( response => { 
    
            this.setState({requesting:false})
            if(response.status=="success")
            {
                if(response.data.length>0)
                {
                    this.setState({images:response.data,isModalVisible:true})
                }
                else
                Alert.alert('No Images for this place')

            }
            
            })
            .catch ( err => {
                this.setState({requesting:false})
                Alert.alert('Error trying to connect with server')
            })
        })
        .catch(err=>{})

  }

  _keyExtractor = (item, index) => item.email;

  render() {

    const {requesting,state,city,data,images,isModalVisible} = this.state

    return (
            <ImageBackground source={require('../img/loginBackground.jpg')} style={{flex:1,backgroundColor:'white',paddingTop:20}}>
                <View style={{justifyContent:'space-around',marginLeft:5,marginRight:5}}>
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
                            this.setState({ city: value});

                            if(value!='null')
                            {
                                this.filterPlaces()
                            }
                        }}
                    
                        style={{ ...pickerSelectStyles }}
                        value={city}
                        
                    />
                </View>

                {
                !requesting?
                <View style={{flex:1,margin:5}}>
                    <FlatList
                        keyExtractor={this._keyExtractor}
                        data={data}
                        renderItem={({ item }) => (
                           <View style={{flex:1,alignItems:'center'}}>
                                <Card>
                                    <CardTitle subtitle={item.fullName.toUpperCase()} />
                                    <CardContent text={item.phone}  />
                                    <View  style={{flex:1}}>
                                        <TouchableOpacity activeOpacity = { .5 } onPress={() => this.showImages(item.email)} style={styles.imageLinkContainer}>
                                            <Image  source={require('../img/imageLink.png')} style={styles.imageLink}/>
                                            <Text style={{color:'#114937'}}> See Pictures</Text> 
                                        </TouchableOpacity>
                                    </View>
                                    <CardAction separator={true} inColumn={false}>
                                        <CardButton
                                                    onPress={() => Communications.phonecall(item.phone, false)}
                                                    title="CALL"
                                                    color="#FEB557"
                                        />
                                        <CardButton
                                            onPress={() => Communications.textWithoutEncoding(item.phone)} 
                                            title="TEXT"
                                            color="#FEB557"
                                        />
                                    </CardAction>
                                </Card>
                            </View>
                        )}
                    />
                </View>
                :
                <View style={{flex:1,margin:5,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator  size="large" color="#114937"/>
                </View> 
                }       

                <Modal isVisible={isModalVisible}>
                    
                        <View style={{flex:1,alignItems:'center',paddingTop:60}}>
                            <Carrousel images={images} />
                            <TouchableOpacity onPress={()=>this.setState({isModalVisible:false})}>
                                <Text style={styles.close}>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                   
                </Modal>
            </ImageBackground>
    );
  }
}

var styles = StyleSheet.create({
    background: {
      flex:1,
      flexDirection: 'column',
      paddingLeft:25,
      paddingRight:25,
      paddingTop:20
    },
    addImage:{
        width:260,
        height:180,
        borderRadius:4,
    },
    information:{
        color:'#114937',
        fontWeight:  'bold',
    },
    imageLinkContainer:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        margin:5,
        
    },
    imageLink:{
        width:50,
        height:50,
    },
    close:{
        color:'white',
        fontWeight:'bold',
        fontSize: 20,
    }
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
        marginBottom:10
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
        marginBottom:10
    }
});
