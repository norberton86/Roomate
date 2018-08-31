import React from 'react';
import Login from './components/Login'
import SignUp from './components/SignUp'
import Forgot from './components/Forgot'
import Profile from './components/Profile'
import Places from './components/Places'
import AuthLoadingScreen from './components/AuthLoadingScreen'
import { createStackNavigator,createBottomTabNavigator,createSwitchNavigator} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AuthStack = createStackNavigator(
  {
    Login: Login,
    SignUp:SignUp,
    Forgot:Forgot
  },
  {
    initialRouteName: 'Login',
  }
);

const SecureTab = createBottomTabNavigator(
  {
    Places: Places,
    Profile: Profile,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state; 
        let iconName;
        if (routeName === 'Places') {
          iconName = `ios-home`;
        } else if (routeName === 'Profile') {
          iconName = `ios-contact`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#114937',
      inactiveTintColor: 'gray',
    },
  }
);

const SwitchNavigator= createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: SecureTab,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

export default class App extends React.Component {

  static navigationOptions = ({navigation}) => { return { headerTransparent: true, headerStyle: { borderBottomWidth: 0, } } }

  constructor(props) {
    super(props);
   
  }

  render() {
     return <SwitchNavigator/>
  }
}

