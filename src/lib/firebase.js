// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK50ikUqWS3ab0_4fdana1pyS5U5MAX0E",
  authDomain: "car-shop-6fb39.firebaseapp.com",
  projectId: "car-shop-6fb39",
  storageBucket: "car-shop-6fb39.firebasestorage.app",
  messagingSenderId: "811387293730",
  appId: "1:811387293730:web:7cbd3cf7bff9dc1911ba7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);

