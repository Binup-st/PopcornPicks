import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAxquMGUFPLAmurrMOxGOI-jd89BUrWY1U",
    authDomain: "popcornpicks-a3b12.firebaseapp.com",
    projectId: "popcornpicks-a3b12",
    storageBucket: "popcornpicks-a3b12.firebasestorage.app",
    messagingSenderId: "303480849372",
    appId: "1:303480849372:web:708c016ab18a3a7ce90519",
    measurementId: "G-SGENSX5RG6"
  };

  export const app = initializeApp(firebaseConfig);