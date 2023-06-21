import {initializeApp} from "firebase/app";
import dynamic from 'next/dynamic';
import {getAnalytics} from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {collection, addDoc, doc, getDocs, getFirestore, setDoc} from 'firebase/firestore';
import {CategoryClass, ExpenseClass} from "./Interfaces";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// TODO make these dynamic at some point

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

    const currentYear = new Date().getFullYear();
    const time_stamp = new Date().getTime();


    const default_category_names = ["Food", "Groceries", "Activities", "Housing", "Transportation", "Medical & Healthcare", "Personal Spending"]

    const default_categories = default_category_names.map((name) => {
        return new CategoryClass("", "", name, currentYear, "", false, time_stamp, 0);
    });

    const categoriesRef = collection(db, 'Users', uid, 'Categories');
    for (const category of default_categories){
        await addDoc(categoriesRef, category.toObject());
    }


    // create budgets collection
    // TODO add default category objects and default budget objects
}

export async function getCategories(user) {
    if (user?.uid) {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'Users', user.uid, 'Categories'));
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        return data;

    }
}


