import firebase from 'firebase/app'
import 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAm3X-Ry6OurzmBxDLgJkVccWx1PyxQBVM",
    authDomain: "crud-udemy-desde0-react.firebaseapp.com",
    projectId: "crud-udemy-desde0-react",
    storageBucket: "crud-udemy-desde0-react.appspot.com",
    messagingSenderId: "952702242912",
    appId: "1:952702242912:web:b95a5a9605fd68d73f3305"
};

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase};