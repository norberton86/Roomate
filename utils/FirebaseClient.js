const firebase = require('firebase')

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBWtlYyUyajedqp6MT5JlWWP4pLN5Xc7kc",
    authDomain: "itorah-59de6.firebaseapp.com",
    databaseURL: "https://itorah-59de6.firebaseio.com",
    projectId: "itorah-59de6",
    storageBucket: "itorah-59de6.appspot.com",
    messagingSenderId: "441220923975"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export default firebaseApp