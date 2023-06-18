import {initializeApp} from "firebase/app";
import dynamic from 'next/dynamic';
import {getAnalytics} from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {collection, doc, getDocs, getFirestore, setDoc} from 'firebase/firestore';
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

export async function saveUserToDatabase(user) {
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(getFirestore(), 'Users', uid);
    const data = {
        uid: uid,
        email: email,
        display_name: displayName,
        photo_url: photoURL,
    };
    await setDoc(ref, data);
}

export async function getCategories(user) {
    if (user?.uid) {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'Users', user.uid, 'Categories'));
        let data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data().category_name);
        });
        return data;

    }
}
