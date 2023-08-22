import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {Auth, getAuth, User} from 'firebase/auth';
import {
    arrayUnion,
    collection,
    doc,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    increment,
    limit,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import {Budget, BudgetClass, Category, CategoryClass, Expense, ExpenseClass, MonthSummary, MonthSummaryClass} from "./Interfaces";
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
const usersDirectory: string = "Users"

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
export async function saveUserToDatabase_depricated(user: User) {
    const db = getFirestore();
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(db, usersDirectory, uid);
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
        return new CategoryClass(currentMonth, 0, name, currentYear, 0, "dashboard");
    });

    const categoriesRef = collection(db, 'Users', uid, 'Categories');
    for (const category of default_categories) {
        const categoryRef = doc(categoriesRef, category.id);
        await setDoc(categoryRef, category.toObject());
    }
}

export async function saveUserToDatabase(user: User) {
    const db = getFirestore();
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(db, usersDirectory, uid);
    // option to ask for user-desired categories during onboarding
    const default_categories = {
        "Food": "dashboard",
        "Groceries": "box",
        "Activities": "beach",
        "Housing": "home",
        "Transportation": "train",
        "Medical & Healthcare": "medical",
        "Personal Spending": "money"
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
    const monthRef = collection(db, usersDirectory, uid, getCurrentMonthString());

    // create summary document for current month
    // categoryTotals is now a collection - category docs will be created on addExpense
    const summaryRef = doc(monthRef, "summary");
    const initialSummary = {
        month: new Date().getMonth() + 1, // getMonth returns month index starting from 0,
        year: new Date().getFullYear(),
        monthTotal: 0,
    }

    await setDoc(summaryRef, initialSummary);


    const budgetsCollectionRef = collection(db, usersDirectory, uid, "Budgets");

    // create budgets for each category
    const default_budgets: BudgetClass[] = [
        new BudgetClass("Food", 500),
        new BudgetClass("Groceries", 500),
        new BudgetClass("Activities", 300),
        new BudgetClass("Housing", 2000),
        new BudgetClass("Transportation", 200),
        new BudgetClass("Medical & Healthcare", 200),
        new BudgetClass("Personal Spending", 300)
    ];
    // create and write a document with the generated ID
    for (const budgetClass of default_budgets) {
        const budgetObject: Budget = budgetClass.toObject();
        const budget_id = budgetClass.id; // Ensure this ID is generated correctly
        const budgetDocRef = doc(budgetsCollectionRef, budget_id); // Reference to the document with ID "budget_id"
        await setDoc(budgetDocRef, budgetObject); // Use the budget_id as the document ID
    }

}

export async function sendExpenseToFirebase(user: User, expense: ExpenseClass) {
    // this function sends an expense to firebase
    // this function is not reactive. It is used to send a single expense to firebase
    if (user?.uid) {
        const db: Firestore = getFirestore();
        const expenseObject = expense.toObject();

        try {
            // get reference to current month
            const monthCollection = getCurrentMonthString();
            const monthRef = collection(doc(collection(db, usersDirectory), user.uid), monthCollection);

            // create and write a document with the generated ID
            const docRef = doc(monthRef, expense.id);
            await setDoc(docRef, expenseObject);
            // console.log("Expense document written with ID: ", docRef.id);

            // update this month's summary doc
            const monthSummary = doc(monthRef, "summary");
            const monthSnap = await getDoc(monthSummary);

            // create the doc if it doesn't exist (such as for a new month)
            if (!monthSnap.exists()) {
                await setDoc(monthSummary, {
                    month: expense.month,
                    year: expense.year,
                    monthTotal: expense.amount,
                });
            }
            else {
                // otherwise expense.amount to the month's total spent
                await updateDoc(monthSummary, {
                    monthTotal: increment(expense.amount),
                });
            }

            const categorySummary = doc(monthSummary, "categoryTotals", expense.category);
            const categorySnap = await getDoc(categorySummary);

            // create new category doc if first expense in this category, otherwise update
            // TODO split this into a helper function
            if (!categorySnap.exists()) {
                const userRef = doc(db, usersDirectory, user.uid);

                // pull budget from matching budget doc
                // only one budget for now - TODO check for weekly/monthly
                const budgetQuery = query(
                    collection(userRef, "Budgets"), 
                    where("category_name", "==", expense.category),
                    limit(1) 
                );  
                const querySnap = await getDocs(budgetQuery);

                // reference to user doc for icon
                const userSnap = await getDoc(userRef);

                const category = new CategoryClass(
                    expense.category,
                    expense.month,
                    expense.year,
                    expense.amount,
                    querySnap.docs[0].data().amount, // budget
                    userSnap.exists() ? userSnap.data().categories[expense.category] : "dashboard", // icon
                )
                await setDoc(categorySummary, category.toObject());
            }
            else {
                await updateDoc(categorySummary, {
                    spent: increment(expense.amount) 
                });
            }
            
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

export async function getCurrentSummary(user: User | null): Promise<MonthSummaryClass> {
    /**
     This function retrieves the current month's summary
     data for a specific user from the Firestore database.
     The summary is expected to be stored in a specific path based
     on the user's unique identifier (UID) and the current month.
     */
    if (user?.uid) {
        const db = getFirestore();
        const monthCollection = getCurrentMonthString();

        const monthRef = collection(db, usersDirectory, user.uid, monthCollection);

        const summaryDoc = doc(monthRef, "summary");
        const summarySnap = await getDoc(summaryDoc);

        if (!summarySnap.exists()) {
            console.log("Month summary does not exist: ", monthCollection, "\nCreating new summary.");
            // throw new Error("Month summary does not exist");
            
            // create a summary doc for the month using initial values
            // TODO: make this a helper function
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const initialSummary = new MonthSummaryClass({
                month: currentMonth,
                year: currentYear,
                monthTotal: 0,
                categoryTotals: [],
            })

            await setDoc(doc(monthRef, "summary"), initialSummary);

            return initialSummary;
        }
        
        const monthData = summarySnap.data();

        // get reference to collection of category summaries
        const categoriesSnap = await getDocs(collection(monthRef, "summary", "categoryTotals"))
        
        // get individual category summaries as Categories
        const categoryTotals : Category[] = [];
        categoriesSnap.forEach((doc) => {
            categoryTotals.push(doc.data() as Category)
        })

        return new MonthSummaryClass({
            month: monthData.month,
            year: monthData.year,
            monthTotal: monthData.monthTotal,
            categoryTotals: categoryTotals,
        })

    } else {
        throw new Error("User not found")
    }
}

export async function getCategories(user: User | null): Promise<{ [key: string]: string }> {
    if (user) {
        // get category dict from User document
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            console.error('User document does not exist:', user.uid);
            throw new Error('User document not found');
        }
        const userData = userSnap.data();
        return userData["categories"] as { [key: string]: string };

    } else {
        throw new Error("User not found")
    }
}

export async function addCategory(user: User | null, category: string, icon: string) {
    // TODO test this function
    if (user) {
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            console.error('User document does not exist:', user.uid);
            throw new Error('User document not found');
        }
        const userData = userSnap.data();
        // add category to user document
        try {
            const newCategories = {...userData["categories"], [category]: icon};
            await updateDoc(userRef, {categories: newCategories});
        } catch (error) {
            console.log("Error adding category: ", error)
        }
    } else {
        throw new Error("User not found")
    }
}

export async function deleteCategory(user: User | null, category: string) {
    // TODO test this function
    if (user) {
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            console.error('User document does not exist:', user.uid);
            throw new Error('User document not found');
        }
        const userData = userSnap.data();
        // remove category from user document
        try {
            const newCategories = {...userData["categories"]};
            delete newCategories[category];
            await updateDoc(userRef, {categories: newCategories});
        } catch (error) {
            console.log("Error deleting category: ", error)
        }
    } else {
        throw new Error("User not found")
    }
}

export async function getExpenses(user: User | null): Promise<Expense[]> {
    if (user) {
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);

        // Construct the path to the current month and year's document
        const monthYearRef = collection(userRef, getCurrentMonthString());

        // Get the document snapshot
        const expensesSnapshot = await getDocs(monthYearRef);
        const expenses: Expense[] = [];
        expensesSnapshot.forEach((doc) => {
            expenses.push(doc.data() as Expense);
        });
        return expenses;
    } else {
        throw new Error("User not found");
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

// noinspection JSUnusedGlobalSymbols
// export async function addCategory(user: User, category: CategoryClass) {
//     // this function adds a category to the database
//     // this function is not reactive. It is used to send a single category to firebase
//     // TODO finish this and make sure that it saved it with the proper month and year
//     if (user?.uid) {
//         const db: Firestore = getFirestore();
//         const categoryObject = category.toObject();
//         // TODO do checks to make sure category object has correct info
//         try {
//             const docRef = await addDoc(collection(db, 'Users', user.uid, 'Categories'), categoryObject);
//             console.log("Category document written with ID: ", docRef.id);
//         } catch (e) {
//             console.error("Error adding document: ", e);
//         }
//     }
// }

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
export async function sendExpenseToFirebase_depricated(user: User, expense: ExpenseClass) {
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

export async function changeCategoryIcon(user: User, iconName: string, category: string): Promise<void> {
    // if (user?.uid) {
    //     const db: Firestore = getFirestore();
    //     try {
    //         const categoryRef = doc(db, 'Users', user.uid, 'Categories', categoryID);
    //         await updateDoc(categoryRef, {iconName: iconName});
    //     } catch (error) {
    //         console.log("Error changing category icon in firebase.tsx: ", error)
    //     }
    // }

    // version for new db structure
    if (user?.uid) {
        const db: Firestore = getFirestore();
        try {
            const userRef = doc(db, usersDirectory, user.uid);
            await updateDoc(userRef, {
                ["categories." + category]: iconName
            });
        } catch (error) {
            console.log("Error changing category icon in firebase.tsx: ", error)
        }
    }
}

function getCurrentMonthString(): string {
    // helper function to return the name of the current month's collection
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth returns month index starting from 0

    return currentMonth.toString() + '_' + currentYear.toString();
}