import React from 'react';
import Login from './components/Login'
import SignUp from './components/SignUp'
import Forgot from './components/Forgot'
import Profile from './components/Profile'

export default class App extends React.Component {


  constructor(props) {
    super(props);
   
  }

  render() {
     return <Profile/>
  }
}

