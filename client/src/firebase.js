// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "blog-sphere-87400.firebaseapp.com",
  projectId: "blog-sphere-87400",
  storageBucket: "blog-sphere-87400.appspot.com",
  messagingSenderId: "1091247548175",
  appId: "1:1091247548175:web:5ced91620cc3180cea407a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
