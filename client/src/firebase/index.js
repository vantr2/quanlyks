// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZsvbYbqBhAE36oFNZwFATA0NomyqJrds",
  authDomain: "quanlykhachsan-1d3b6.firebaseapp.com",
  projectId: "quanlykhachsan-1d3b6",
  storageBucket: "quanlykhachsan-1d3b6.appspot.com",
  messagingSenderId: "443910245090",
  appId: "1:443910245090:web:55ad81c97c2d6fa13e2cbb",
  measurementId: "G-L68GC723S9",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { storage, firebase as default };
