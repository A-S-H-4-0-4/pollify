// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQHCYDWpJaB1eQP3trmsA0j44gQmdx1gE",
  authDomain: "pollify-cf239.firebaseapp.com",
  databaseURL: "https://pollify-cf239-default-rtdb.firebaseio.com",
  projectId: "pollify-cf239",
  storageBucket: "pollify-cf239.appspot.com",
  messagingSenderId: "382089940267",
  appId: "1:382089940267:web:c140b6f9f99765abfb096e"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);