import firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyBAauScryXynY1jaroN2viYG9wT3YAjUs0",
    authDomain: "uwizer.firebaseapp.com",
    databaseURL: "https://uwizer.firebaseio.com",
    projectId: "uwizer",
    storageBucket: "uwizer.appspot.com",
    messagingSenderId: "1176808257",
    appId: "1:1176808257:web:d1dbdb0bb6e7cfd9"
  };

export const firebaseImpl = firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firebaseDatabase = firebase.database();
export const firebaseStorage= firebase.storage();