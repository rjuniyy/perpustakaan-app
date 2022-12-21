import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2X1VyjMQW4KvtdnDi9bM4rfSeRZcVdn4",
  authDomain: "perpus-ea96f.firebaseapp.com",
  projectId: "perpus-ea96f",
  storageBucket: "perpus-ea96f.appspot.com",
  messagingSenderId: "206050585672",
  appId: "1:206050585672:web:7abfc6549d69fb7017bc7d",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
