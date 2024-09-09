// Import Firebase and Firestore modules

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


console.log(window.location.href)
// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_LXeId89txDwnvZuEeFBzC1rkgZB3bbY",
    authDomain: "projectm-894b9.firebaseapp.com",
    projectId: "projectm-894b9",
    storageBucket: "projectm-894b9.appspot.com",
    messagingSenderId: "467678578464",
    appId: "1:467678578464:web:a9ac1f80a868e17b8e3945",
    measurementId: "G-F5Q8CQ38NG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);