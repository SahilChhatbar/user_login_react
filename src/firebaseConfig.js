// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjF8Q8I9m1MLoUqEKzjvW5PFA93RzWh-M",
  authDomain: "userlogin-a62cb.firebaseapp.com",
  projectId: "userlogin-a62cb",
  storageBucket: "userlogin-a62cb.appspot.com",
  messagingSenderId: "24212987554",
  appId: "1:24212987554:web:2875b4fee7d90fdcaa81fb",
  measurementId: "G-FCL6L4XX91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
