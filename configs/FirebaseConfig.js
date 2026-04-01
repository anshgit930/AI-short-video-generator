// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.iNEXT_PUBLIC_FIREBASE_API_KEY ,
  authDomain: "ai-short-video-generator-71176.firebaseapp.com",
  projectId: "ai-short-video-generator-71176",
  storageBucket: "ai-short-video-generator-71176.firebasestorage.app",
  messagingSenderId: "332923900323",
  appId: "1:332923900323:web:b3c4ea20288f3b2f9d0a16",
  measurementId: "G-J7NXJQVQBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);