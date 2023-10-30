import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {Auth, getAuth, User} from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    Firestore,
    getDoc,
    getDocs,
    getFirestore,
    increment,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import {
    Category,
    CategoryClass,
    CustomButton,
    DatabaseUser,
    Expense,
    ExpenseClass,
    Goal,
    GoalClass,
    MonthSummary,
} from "@/lib/Interfaces";
import {useEffect, useState} from "react";
import {Timestamp} from "@firebase/firestore";
// TODO add react-query-firebase to handle caching and offline data

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
let auth: Auth;
let analytics;
const usersDirectory: string = "Users"

if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    analytics = getAnalytics(app);
}

export {app, auth, analytics};

export async function migrateExpenses(user: User) {
    // For each month, look for expenses under the old db structure
    // In the new db structure, create a new month doc and Expenses collection, and copy the expenses to it
    // Also update the month summary by collating expenses
    if (user?.uid) {
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);

        const monthNames = ["7_2023", "8_2023", "9_2023", "10_2023"];

        // for the past few months
        for (const month of monthNames) {
            const monthDocRef = doc(userRef, "Months", month); // reference to new month's document
            const monthDoc = await getDoc(monthDocRef);

            const initialSummary = {
                month: month,
                year: 2023,
                monthTotal: 0,
                categoryTotals: {
                    "FoodTotal": 0,
                    "GroceriesTotal": 0,
                    "ActivitiesTotal": 0,
                    "HousingTotal": 0,
                    "TransportationTotal": 0,
                    "Medical & HealthcareTotal": 0,
                    "Personal SpendingTotal": 0,
                }
            }

            // use existing new month doc if it exists
            const runningSummary = monthDoc?.data() ?? initialSummary;
            const monthSnap = await getDocs(collection(userRef, month)); // get old expenses

            monthSnap.forEach((document) => {
                const expData = document.data();

                if (expData.id) { // non-summaries
                    // console.log(document.id);

                    // create new expense
                    setDoc(doc(monthDocRef, "Expenses", expData.id), expData);

                    // keep track of summary info
                    runningSummary["categoryTotals"][expData.category + "Total"] += expData.amount;
                    runningSummary["monthTotal"] += expData.amount;
                }
            })

            // set new summary doc (in the month doc)
            await setDoc(monthDocRef, runningSummary);
        }

        console.log("Migration complete")
    }

}

export async function saveUserToDatabase(user: User): Promise<void> {
    const db = getFirestore();
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(db, usersDirectory, uid);

    // option to ask for user-desired categories during onboarding
    const defaultCategoriesAndIcons: {[category: string]: string} = {
        "Food": "dashboard",
        "Groceries": "box",
        "Activities": "beach",
        "Housing": "home",
        "Transportation": "train",
        "Medical & Healthcare": "medical",
        "Personal Spending": "money"
    }

    const userData: DatabaseUser = {
        uid: uid,
        email: email ?? "",
        displayName: displayName ?? "",
        photoURL: photoURL,
    };
    await setDoc(ref, userData);
    // create default categories
    const defaultCategories: CategoryClass[] = [];
    for (const category in defaultCategoriesAndIcons) {
        const icon: string = defaultCategoriesAndIcons[category];
        defaultCategories.push(new CategoryClass(category, icon, 0));
    }
    const defaultCategoriesJson: Category[] = defaultCategories.map((category) => category.toJson());


    // create current month
    await createCurrentMonth(db, user, defaultCategoriesJson);


    // create collection for the current month and summary document for current month
    // this will need to happen for each new month >> write into addExpense (if currMonth doc doesn't exist, create it)

    const categoriesCollectionRef = collection(db, usersDirectory, uid, "Categories");

    // create budgets for each category

    // create and write a document with the generated ID
    for (const categoryClass of defaultCategories) {
        const categoryJson: Category = categoryClass.toJson();
        const categoryID = categoryClass.categoryID; // Ensure this ID is generated correctly
        const categoryDocRef = doc(categoriesCollectionRef, categoryID); // Reference to the document with ID "budget_id"
        await setDoc(categoryDocRef, categoryJson); // Use the category_id as the document ID
    }

    // create goals collection and goals summary
    const goalsRef = collection(db, usersDirectory, uid, "Goals");
    const goalSummary = doc(goalsRef, "summary")
    await setDoc(goalSummary, {numGoals: 0})

}


async function createCurrentMonth(db: Firestore, user: User | null, categories: Category[]) {
    // This is a helper function to create a new month summary document.
    //  Called when user is first created, or if current summary is not found
    //  (i.e. it's a new month - getCurrentSummary, useCategoryBudgets) 
    if (user?.uid) {
        const monthCollectionRef = collection(db, usersDirectory, user.uid, "Months");
        const monthDoc = doc(monthCollectionRef, getCurrentMonthString());

        // create document for current month, containing initial summary info


        const categoryTotals: { [key: string]: number } = {}

        for (const category of categories) {
            categoryTotals[category.categoryID] = 0;
        }

        const initialSummary: MonthSummary = {
            monthTotal: 0,
            categoryTotals: categoryTotals,
        }

        await setDoc(monthDoc, initialSummary);
    } else {
        throw new Error("User not found (create current month doc)");
    }
}

export async function useCategories(user: User | null): Promise<Category[] | null> {

    const firestore = useFirestore();

}


export async function addOrUpdateExpense(user: User | null, expense: ExpenseClass) {
    // TODO update. Should be `addOrUpdateExpense` and handle both cases
    // this function sends an expense to firebase
    // this function is not reactive. It is used to send a single expense to firebase
    if (user?.uid) {
        const db: Firestore = getFirestore();
        const expenseObject = expense.toJson();

        try {
            // get reference to current month
            const monthString = getCurrentMonthString();
            const monthRef = doc(db, usersDirectory, user.uid, "Months", monthString);

            // create and write an expense document with the generated ID
            const expenseRef = doc(monthRef, "Expenses", expense.id);
            await setDoc(expenseRef, expenseObject);

            // update this month's summary
            // add expense.amount to the month's total spent and the category total
            // individual category totals are nested within categoryTotals
            await updateDoc(monthRef, {
                monthTotal: increment(expense.amount),
                ["categoryTotals." + expense.category + "Total"]: increment(expense.amount)
            });

            console.log("Document written with ID: ", expenseRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}


export async function getCurrentSummary(user: User | null, month?: string): Promise<MonthSummary> {
    /**
     This function retrieves the current month's summary
     data for a specific user from the Firestore database.
     The summary is expected to be stored in a specific path based
     on the user's unique identifier (UID) and the current month.
     */
    if (user?.uid) {
        const db = getFirestore();

        const monthString = month ? month : getCurrentMonthString();

        const monthDoc = await getDoc(doc(db, usersDirectory, user.uid, "Months", monthString));

        // const summaryDoc = await getDoc(doc(monthRef, "summary"));
        if (!monthDoc.exists()) {
            console.log("Month summary does not exist; creating:", monthString);
            // await createCurrentMonth(db, user);
            throw new Error("Month summary does not exist");
        }
        return monthDoc.data() as MonthSummary;
    } else {
        throw new Error("User not found (get current summary")
    }
}


export async function addCategory(user: User | null, category: Category, isYearly: boolean = false) {
    // TODO update
    if (user) {
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            console.error('User document does not exist:', user.uid);
            throw new Error('User document not found');
        }
        // add budget to user document
        const isMonthly = true;
        const newCategory = new CategoryClass(category.category, category.budgetAmount, isMonthly, isYearly);
        const budgetsRef = collection(userRef, "Budgets");
        const budgetRef = doc(budgetsRef, newBudget.id);
        await setDoc(budgetRef, newCategory.toJson());

    } else {
        throw new Error("User not found")
    }
}

export async function deleteCategory(user: User | null, category: string) {
    // TODO
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


export async function changeCategoryIcon(user: User, iconName: string, categoryName: string): Promise<void> {
    if (user?.uid) {
        const db: Firestore = getFirestore();
        try {
            //    path is: Users -> user.uid -> categories
            //     categories is a dictionary with key=category name, value=icon name
            const userRef = doc(db, usersDirectory, user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                throw new Error('User document not found');
            }
            const userData = userSnap.data();
            const newCategories = {...userData["categories"], [categoryName]: iconName};
            await updateDoc(userRef, {categories: newCategories});
        } catch (error) {
            console.log("Error changing category icon in firebase.tsx: ", error)
        }
    }
}


export function useExpenses(user: User | null, month?: number, year?: number, monthly?: boolean): Expense[] {
    /**
     * this function is the hook version of the `getExpenses` function above.
     * Instead of doing it once, it will listen for changes and update accordingly.
     */

    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if (user) {
            const db = getFirestore();
            const userRef = doc(db, usersDirectory, user.uid);
            const expensesRef = collection(userRef, "Months", getCurrentMonthString(), "Expenses");
            const expensesQuery = query(expensesRef, orderBy("date", "desc"));

            const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
                const newExpenses: Expense[] = [];
                snapshot.forEach((doc) => {
                    if (doc.id !== "summary") {
                        const expenseData = doc.data() as Expense;
                        // console.log("monthly: ", expenseData.name, expenseData.is_monthly)
                        if (expenseData.date instanceof Timestamp) {
                            const date: Date = expenseData.date.toDate();
                            expenseData.date = date.toLocaleDateString();
                        }

                        if (monthly === undefined || !monthly) {
                            if (!expenseData.is_monthly) {
                                newExpenses.push(expenseData);
                            }
                        } else if (monthly) {
                            if (expenseData.is_monthly) {
                                newExpenses.push(expenseData);
                            }
                        }
                    }
                });
                setExpenses(newExpenses);
            });

            return () => unsubscribe();
        }
    }, [user, month, year, monthly]);

    return expenses;
}

// ------- GOALS -------

export const useGoals = (user: User | null): Goal[] | null => {
    /**
     * This function is a React hook that returns goals
     * for a specific user from the Firestore database.
     */
    const [goals, setGoals] = useState<Goal[] | null>(null);

    useEffect(() => {
        if (user) {
            const db = getFirestore();
            const goalsRef = collection(db, usersDirectory, user.uid, "Goals");

            // const summaryDocRef = doc(goalsRef, "summary");

            const fetchAndUpdate = async () => {
                // console.log('Fetching and updating data...');

                const goalsSnap = await getDocs(goalsRef);
                // const summaryDoc = await getDoc(summaryDocRef);
                // if (!summaryDoc.exists()) {
                //     console.log("Creating summary doc for user goals... ")
                //    
                // }

                const goals: Goal[] = [];
                goalsSnap.forEach((doc) => {
                    goals.push(doc.data() as Goal);
                });

                setGoals(goals);
            };

            const unsubscribeGoals = onSnapshot(goalsRef, fetchAndUpdate);
            // const unsubscribeSummary = onSnapshot(summaryDocRef, fetchAndUpdate);

            // Unsubscribe from changes when the effect is cleaned up
            return () => {
                unsubscribeGoals();
                // unsubscribeSummary();
            };
        }
    }, [user]);
    // if (categoryBudgets === null) {
    //     console.warn("Category budgets is null. See Firebase.tsx file")
    //     console.log(categoryBudgets)
    //     return [];
    // }
    return goals && goals.length > 0 ? goals : null;
};

export async function addNewGoal(user: User | null, goal_name: string, amt_goal: number, goal_date: Date) {
    if (user) {
        const db = getFirestore();
        const goalsRef = collection(db, usersDirectory, user.uid, "Goals");

        try {
            // add new goal
            const new_goal = new GoalClass(goal_name, amt_goal, goal_date,)
            await setDoc(doc(goalsRef, new_goal.id), new_goal.toJson());
        } catch (error) {
            console.log("Error adding goal: ", error)
        }
    } else {
        throw new Error("User not found (adding new goal)")
    }
}

export async function editGoal(user: User | null, goal: Goal) {
    if (user) {
        const db = getFirestore();
        const goalRef = doc(db, usersDirectory, user.uid, "Goals", goal.id);

        try {
            // edit existing goal
            await setDoc(goalRef, goal);
        } catch (error) {
            console.log("Error editing goal: ", goal.goal_name, error)
        }
    } else {
        throw new Error("User not found (editing goal)")
    }
}

export async function deleteGoal(user: User | null, goalID: string) {
    if (user) {
        const db = getFirestore();
        const goalRef = doc(db, usersDirectory, user.uid, "Goals", goalID);

        try {
            // delete existing goal
            await deleteDoc(goalRef);
        } catch (error) {
            console.log("Error editing goal: ", goalID, error)
        }
    } else {
        throw new Error("User not found (deleting goal)")
    }
}

// TODO: goal summary?

function getCurrentMonthString(): string {
    // helper function to return the name of the current month's collection
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth returns month index starting from 0

    return currentMonth.toString() + '_' + currentYear.toString();
}

function createMonthYearString(month: number, year: number): string {
    return month.toString() + '_' + year.toString();

}

// BUTTONS


export function useButtons(user: User | null): { buttons: CustomButton[], loading: boolean } {
    const [buttons, setButtons] = useState<CustomButton[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Initialize loading state to true

    useEffect(() => {
        if (user) {
            setLoading(true); // Set loading to true when data fetch starts

            const db = getFirestore();
            const userRef = doc(db, usersDirectory, user.uid);
            const buttonsRef = collection(userRef, "Buttons");

            const unsubscribe = onSnapshot(buttonsRef, (snapshot) => {
                const newButtons: CustomButton[] = [];
                snapshot.forEach((doc) => {
                    newButtons.push(doc.data() as CustomButton);
                });
                setButtons(newButtons);

                setLoading(false); // Set loading to false when data fetch is complete
            });

            return () => {
                unsubscribe();
            };
        } else {
            setLoading(false); // Set loading to false if there is no user
        }
    }, [user]); // Dependency array

    return {buttons, loading};
}

export async function addButton(user: User | null, newButton: CustomButton) {
    if (user) {
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            console.error('User document does not exist:', user.uid);
            throw new Error('User document not found');
        }
        // Get a reference to the Buttons collection inside the user's document
        const buttonsCollectionRef = collection(userRef, 'Buttons');
        // Add the new button to the collection
        await addDoc(buttonsCollectionRef, newButton);

    } else {
        console.warn("User not found. `addButton` function failed.");
    }
}