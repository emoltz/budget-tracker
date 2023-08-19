import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {Auth, getAuth, User} from 'firebase/auth';
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    Firestore,
    getDoc,
    getFirestore,
    increment,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import {Category, CategoryClass, ExpenseClass, MonthSummary} from "./Interfaces";
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



// export function postToJSON(doc: DocumentSnapshot) {
//     const data = doc.data();
//     return {
//         ...data,
//         // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
//         created_date: data?.created_date.toMillis() || 0,
//     };
// }

// function timestampToDate(timestamp: number) {
//     return new Date(timestamp * 1000);
// }

// noinspection JSCommentMatchesSignature
export async function saveUserToDatabase(user: User) {
    const db = getFirestore();
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(db, 'Users_New', uid);
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

export async function saveUserToDatabaseNew(user: User) {
    const db = getFirestore();
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(db, 'Users_New', uid);
    // option to ask for user-desired categories during onboarding
    const default_categories = {
        // TODO marry values to icon definitions
        "Food" : "beer", 
        "Groceries" : "box", 
        "Activities" : "beach", 
        "Housing" : "home", 
        "Transportation" : "train", 
        "Medical & Healthcare" : "medical", 
        "Personal Spending" : "money"
    }

    const data = {
        uid: uid,
        email: email,
        display_name: displayName,
        categories: default_categories,
        photo_url: photoURL,
    };
    await setDoc(ref, data);

    // create collection for the current month
    const monthRef = collection(db, 'Users_New', uid, getCurrentMonthString());

    // create summary document for current month
    // this will need to happen for each new month >> write into addExpense (if currMonth doc doesn't exist, create it)
    const summaryRef = doc(monthRef, "summary");

    // TODO: connect to budget

    const budgetRef = doc(monthRef, "Budgets");
    // create budgets for each category
    const default_budgets = {}


    // create summary document for current month
    const initialSummary : MonthSummary = {
        month: new Date().getMonth() + 1, // getMonth returns month index starting from 0,
        year: new Date().getFullYear(),
        monthTotal: 0,
        categoryTotals: {}
    }

    await setDoc(summaryRef, initialSummary);
}

export async function sendExpenseToFirebaseNew(user: User, expense: ExpenseClass) {
    // this function sends an expense to firebase
    // this function is not reactive. It is used to send a single expense to firebase
    if (user?.uid) {
        const db: Firestore = getFirestore();
        const expenseObject = expense.toObject();

        try {
            // get reference to current month
            const monthCollection = getCurrentMonthString();
            const monthRef = collection(doc(collection(db, 'Users_New'), user.uid), monthCollection);

            // create and write a document with the generated ID
            const docRef = doc(monthRef, expense.id);
            await setDoc(docRef, expenseObject);

            // update this month's summary doc
            // should create the doc if it doesn't exist
            const summaryRef = doc(monthRef, "summary");

            // add expense.amount to the month's total spent and the category total
            // individual category totals are nested within categoryTotals
            await updateDoc(summaryRef, {
                monthTotal: increment(expense.amount),
                ["categoryTotals." + expense.category + "Total"]: increment(expense.amount)
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

export async function getCurrentSummary(user: User | null): Promise<MonthSummary> {
    if (user?.uid) {
        const db = getFirestore();
        const monthCollection = getCurrentMonthString();

        const monthRef = collection(doc(collection(db, 'Users_New'), user.uid), monthCollection);

        const summaryDoc = await getDoc(doc(monthRef, "summary"));

        if (!summaryDoc.exists()) {
            console.log("Month summary does not exist:", monthCollection);
            throw new Error("Month summary does not exist");
        }
        return summaryDoc.data() as MonthSummary;
    }
    else {
        throw new Error("User not found")
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

export async function getUserCategories(user: User | null) : Promise<string[]>{
    // get category names only (stored as part of User document)
    if (user?.uid) {
        const db = getFirestore();

        const userRef = doc(db, 'Users_New', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return Object.keys(userSnap.data()["categories"]);
        }
    }

    return ["Error returning categories"];
}

// noinspection JSUnusedGlobalSymbols
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
                // noinspection ExceptionCaughtLocallyJS
                throw new Error("Category does not exist");
            }
            const categoryData = categorySnapshot.data();
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

// noinspection JSUnusedGlobalSymbols
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

function getCurrentMonthString() : string{
    // helper function to return the name of the current month's collection
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth returns month index starting from 0

    return currentMonth.toString() + '_' + currentYear.toString();
}