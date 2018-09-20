import React from 'react';
import {ImageBackground,AsyncStorage,StatusBar,StyleSheet,Image} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
  
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    };
  
    // Render any loading content that you like here
    render() {
      return (
        <ImageBackground source={require('../img/loginBackground.jpg')} style={styles.container}>
           <Image source={require('../img/syntelLogo.png')} style={styles.syntelLogo}/>
          <StatusBar barStyle="default" />
        </ImageBackground>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    syntelLogo:{
      width:'60%',
      height:'35%',
    },
  });