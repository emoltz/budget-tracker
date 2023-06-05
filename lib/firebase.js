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

export { app, auth, analytics };


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


export async function testFetchData(){
    const testCollection = collection(firestore, 'Users');
    const snapshot = await getDocs(testCollection);
    const data = snapshot.docs.map(doc => doc.data());
    console.log(data);
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