// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2X1VyjMQW4KvtdnDi9bM4rfSeRZcVdn4",
  authDomain: "perpus-ea96f.firebaseapp.com",
  projectId: "perpus-ea96f",
  storageBucket: "perpus-ea96f.appspot.com",
  messagingSenderId: "206050585672",
  appId: "1:206050585672:web:7abfc6549d69fb7017bc7d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
