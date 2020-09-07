import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "FIX_ME",
  authDomain: "instagram-clone-react-e82a9.firebaseapp.com",
  databaseURL: "https://instagram-clone-react-e82a9.firebaseio.com",
  projectId: "instagram-clone-react-e82a9",
  storageBucket: "instagram-clone-react-e82a9.appspot.com",
  messagingSenderId: "561427686162",
  appId: "1:561427686162:web:13fd3dd697113c01d349cb",
  measurementId: "G-LRV03VWLY1",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
