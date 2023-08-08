import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {Auth, getAuth, User} from 'firebase/auth';
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    DocumentSnapshot,
    Firestore,
    getDoc, getDocs,
    getFirestore,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import {Category, CategoryClass, ExpenseClass} from "./Interfaces";
import {useEffect, useState} from "react";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*
    TODO:
    [] handle monthly expenses
    [] handle yearly expenses
    [] firebase-admin for server-side authentication
 */

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
let auth: Auth;
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
export function postToJSON(doc: DocumentSnapshot) {
    const data = doc.data();
    return {
        ...data,
        // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        created_date: data?.created_date.toMillis() || 0,
    };
}

function timestampToDate(timestamp: number) {
    return new Date(timestamp * 1000);
}

export async function saveUserToDatabase(user: User) {
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

    const default_category_names = ["Food", "Groceries", "Activities", "Housing", "Transportation", "Medical & Healthcare", "Personal Spending"]

    const default_categories: CategoryClass[] = default_category_names.map((name) => {
        return new CategoryClass(currentMonth, 0, name, currentYear, 0);
    });

    const categoriesRef = collection(db, 'Users', uid, 'Categories');
    for (const category of default_categories) {
        const categoryRef = doc(categoriesRef, category.id);
        await setDoc(categoryRef, category.toObject());
    }
}

export function useCategories(user: User | null): Category[] {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (user?.uid) {
            const db = getFirestore();
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // getMonth returns month index starting from 0

            const unsubscribe = onSnapshot(
                query(
                    collection(db, 'Users', user.uid, 'Categories'),
                    where("year", "==", currentYear),
                    where("month", "==", currentMonth)
                ),
                (snapshot) => {
                    const newData: Category[] = [];
                    snapshot.forEach((doc) => {
                        newData.push(doc.data() as Category);
                    });
                    setCategories(newData);
                }
            );

            // Clean up listener on unmount
            return () => unsubscribe();
        }
    }, [user]);

    return categories;
}

export async function addCategory(user: User, category: CategoryClass) {
    // this function adds a category to the database
    // this function is not reactive. It is used to send a single category to firebase
    // TODO finish this and make sure that it saved it with the proper month and year
    if (user?.uid) {
        const db: Firestore = getFirestore();
        const categoryObject = category.toObject();
        // TODO do checks to make sure category object has correct info
        try {
            const docRef = await addDoc(collection(db, 'Users', user.uid, 'Categories'), categoryObject);
            console.log("Category document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

async function saveExpenseToCategory(user: User, expense: ExpenseClass) {
    /*
        The purpose of this function is to marry the expense to the category in firebase and keep a record of all expenses
        It's a helper function to `sendExpenseToFirebase`
        Note that it is not exported, so you can't use it anywhere else but this file.
     */
    if (user?.uid) {
        const db: Firestore = getFirestore();
        // const expenseObject = expense.toObject();
        try {
            const categoryIdentifier = expense.categoryID;
            const categoryRef = doc(collection(doc(collection(db, 'Users'), user.uid), 'Categories'), categoryIdentifier);
            const categorySnapshot = await getDoc(categoryRef);
            if (!categorySnapshot.exists()) {
                console.log("Category does not exist:", categoryIdentifier);
                throw new Error("Category does not exist");
            }
            let categoryData = categorySnapshot.data();
            // this will add the expense.amount to the category's spent amount
            categoryData.spent += expense.amount;
            //append to list of expenses
            categoryData.expenses = arrayUnion(expense.id);

            // update in database
            await updateDoc(categoryRef, categoryData);

            // add expense to expenses collection
            // const expenseRef = doc(collection(doc(collection(db, 'Users'), user.uid), 'Expenses'), expense.id);
            // await setDoc(expenseRef, expenseObject);


        } catch (e) {
            console.error("Error saving expense to category: ", e);
        }
    }
}

export async function sendExpenseToFirebase(user: User, expense: ExpenseClass) {
    // this function sends an expense to firebase
    // this function is not reactive. It is used to send a single expense to firebase
    if (user?.uid) {
        const db: Firestore = getFirestore();
        const expenseObject = expense.toObject();

        try {
            // Create a reference with the generated ID
            const docRef = doc(collection(db, 'Users', user.uid, 'Expenses'), expense.id);

            // Write the document with the generated ID
            await setDoc(docRef, expenseObject);
            await saveExpenseToCategory(user, expense);

            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

export async function changeCategoryIcon(user: User, iconName: string, categoryID: string): Promise<void> {
    if (user?.uid) {
        const db: Firestore = getFirestore();
        try {
            const categoryRef = doc(db, 'Users', user.uid, 'Categories', categoryID);
            await updateDoc(categoryRef, {iconName: iconName});
        } catch (error) {
            console.log("Error changing category icon in firebase.tsx: ", error)
        }
    }

}