import React from 'react';
import { StyleSheet, Text, View ,ImageBackground, ActivityIndicator,KeyboardAvoidingView,Image,TouchableOpacity,FlatList} from 'react-native';
import DismissKeyBoard from './DismissKeyBoard'
import Carrousel from './Carrousel'
import RNPickerSelect from 'react-native-picker-select';
import {data} from './data'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import Communications from 'react-native-communications';

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      
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

  render() {

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
                </View>

                <View style={{flex:1,margin:5}}>
                    <FlatList
                        data={data}
                        renderItem={({ item }) => (
                           <View style={{flex:1,alignItems:'center'}}>
                                    
                                {item.images.length>0? 
                                    <Carrousel images={item.images} />
                                    :
                                    <Image  source={require('../img/not-available.png')} style={styles.addImage}/>
                                }
                                
                                <Card>

                                    <CardTitle subtitle={item.name} />
                                    <CardContent text={item.phone} />
                                    <CardAction separator={true} inColumn={false}>
                                        <CardButton
                                                    onPress={() => Communications.phonecall('8329232869', false)}
                                                    title="CALL"
                                                    color="#FEB557"
                                        />
                                        <CardButton
                                            onPress={() => Communications.textWithoutEncoding('8329232869')} 
                                            title="TEXT"
                                            color="#FEB557"
                                        />
                                    </CardAction>

                                </Card>
                            </View>
                        )}
                    />
                </View>
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
        height:180
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
        marginBottom:10
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
        marginBottom:10
    }
});
