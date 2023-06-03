import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
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

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        created_date: data?.created_date.toMillis() || 0,
    };
}

export async function saveUserToFirebase(user) {
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(getFirestore(), 'users', uid);
    const data = {
        uid,
        email,
        displayName,
        photoURL,
    };
    await setDoc(ref, data);
}

export function getCurrentUser() {
    let userEmail = null;
    let userDisplayName = null;
    let userID = null;
    const currentUser = auth.currentUser;
    if (currentUser) {
        const {email, displayName, uid} = currentUser;
        // console.log(email, displayName, uid);
        userEmail = email;
        userDisplayName = displayName;
        userID = uid;
    } else {
        console.warn("Firebase.js: No user is signed in");
    }
    return {currentUser, userEmail, userDisplayName, userID};
}