// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import {getAuth} from 'firebase/auth';
import {
    query,
    where,
    limit,
    doc,
    getFirestore,
    collection,
    getDocs,
    deleteDoc,
    serverTimestamp, setDoc
} from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "budget-tracker-bcf59.firebaseapp.com",
  projectId: "budget-tracker-bcf59",
  storageBucket: "budget-tracker-bcf59.appspot.com",
  messagingSenderId: "1083693993969",
  appId: "1:1083693993969:web:4a86f787868c4a38ed3e50",
  measurementId: "G-RE7VNMNYER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);