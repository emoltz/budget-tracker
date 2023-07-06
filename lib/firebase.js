import {initializeApp} from "firebase/app";
import dynamic from 'next/dynamic';
import {getAnalytics} from "firebase/analytics";
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {collection, addDoc, doc, getDocs, getFirestore, setDoc, query, where} from 'firebase/firestore';
import {CategoryClass, ExpenseClass} from "./Interfaces";
import {useEffect, useState} from "react";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// TODO make these dynamic at some point?

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "budget-tracker-bcf59.firebaseapp.com",
    projectId: "budget-tracker-bcf59",
    storageBucket: "budget-tracker-bcf59.appspot.com",
    messagingSenderId: "1083693993969",
    appId: "1:1083693993969:web:4a86f787868c4a38ed3e50",
    measurementId: "G-RE7VNMNYER"
};

// Initialize Firebase

let app;
let auth;
let analytics;

if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    analytics = getAnalytics(app);
}

export {app, auth, analytics};


/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        created_date: data?.created_date.toMillis() || 0,
    };
}

function timestampToDate(timestamp) {
    return new Date(timestamp * 1000);
}

export async function saveUserToDatabase(user) {
    const db = getFirestore();
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(db, 'Users', uid);
    const data = {
        uid: uid,
        email: email,
        display_name: displayName,
        photo_url: photoURL,
    };
    await setDoc(ref, data);

    // create categories collection inside user document
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth returns month index starting from 0
    const time_stamp = currentDate.getTime();

    const default_category_names = ["Food", "Groceries", "Activities", "Housing", "Transportation", "Medical & Healthcare", "Personal Spending"]

    const default_categories = default_category_names.map((name) => {
        return new CategoryClass(currentMonth, "", name, currentYear, 0, false, time_stamp, 0);
    });

    const categoriesRef = collection(db, 'Users', uid, 'Categories');
    for (const category of default_categories){
        await addDoc(categoriesRef, category.toObject());
    }
}


export async function getCategories(user) {
    // this function returns the categories for a user in the form of a list of Category objects.
    // current month and year only!
    // it is different then `useCategories` because it is not a hook and it is not reactive. This can be used in general cases where you just want to get the categories for a user.
    if (user?.uid) {
        const db = getFirestore();
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth returns month index starting from 0

        const querySnapshot = await getDocs(
            query(
                collection(db, 'Users', user.uid, 'Categories'),
                where("year", "==", currentYear),
                where("month", "==", currentMonth)
            )
        );
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        return data;
    }
}

export function useCategories(user) {
    // this function is a hook that returns the categories for a user in the form of a list of Category objects
    // current month and year only!
    // this is different from getCategories because it is reactive and will update when the categories change
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories(user).then((data) => setCategories(data));
    }, [user]);

    return categories;
}

export async function sendExpenseToFirebase(user, expense){
    // this function sends an expense to firebase
    // this function is not reactive. It is used to send a single expense to firebase
    if (user?.uid){
        const db = getFirestore();
        const expenseObject = expense.toObject();

        try{
            const docRef = await addDoc(collection(db, 'Users', user.uid, 'Expenses'), expenseObject);
            console.log(expenseObject)
        } catch(e){
            console.error("error adding document: ", e);
        }
    }
}



