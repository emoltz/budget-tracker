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

const defaultCategoriesAndIcons: {[category: string]: string} = {
    "Food": "dashboard",
    "Groceries": "box",
    "Activities": "beach",
    "Housing": "home",
    "Transportation": "train",
    "Medical & Healthcare": "medical",
    "Personal Spending": "money"
}

if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    analytics = getAnalytics(app);
}

export {app, auth, analytics};


export async function saveUserToDatabase(user: User, userCategories: CategoryClass[] | null = null): Promise<void> {
    const db = getFirestore();
    const {uid, email, displayName, photoURL} = user;
    const ref = doc(db, usersDirectory, uid);

    const userData: DatabaseUser = {
        uid: uid,
        email: email ?? "",
        displayName: displayName ?? "",
        photoURL: photoURL,
    };
    await setDoc(ref, userData);

    //// create user's categories (list of default categories and icons is now global)
    // option to ask for user-desired categories during onboarding

    // create top level Categories collection 
    const categoriesCollectionRef = collection(db, usersDirectory, uid, "Categories");
    
    const newCategories: CategoryClass[] = [];
    if (userCategories) {
        // if custom categories passed, use those
        newCategories.push(...userCategories);
    }
    else {
         // otherwise create CategoryClass list of categories from defaults
        for (const category in defaultCategoriesAndIcons) {
            const icon: string = defaultCategoriesAndIcons[category];
            newCategories.push(new CategoryClass(category, icon, 0));
        }
    }

    // create and write category documents with the generated IDs
    for (const categoryClass of newCategories) {
        const categoryJson: Category = categoryClass.toJson();
        const categoryID = categoryClass.categoryID; // Ensure this ID is generated correctly
        const categoryDocRef = doc(categoriesCollectionRef, categoryID); // Reference to the document with ID "budget_id"
        await setDoc(categoryDocRef, categoryJson); // Use the category_id as the document ID
    }
    
    // create collection for the current month's expenses and summary document for current month
    // this will need to happen for each new month >> write into addExpense (if currMonth doc doesn't exist, create it)
    await createCurrentMonth(db, user, defaultCategoriesAndIcons);
    
    //// create goals collection and goals summary
    const goalsRef = collection(db, usersDirectory, uid, "Goals");
    const goalSummary = doc(goalsRef, "summary")
    await setDoc(goalSummary, {numGoals: 0})
}


async function createCurrentMonth(db: Firestore, user: User | null, categories: {[category: string]: string}) {
    // This is a helper function to create a new month summary document.
    //  Called when user is first created, or if current summary is not found
    //  (i.e. it's a new month - getMonthSummary, useCategoryBudgets) 
    if (user?.uid) {
        const monthCollectionRef = collection(db, usersDirectory, user.uid, "Months");
        const [thisMonth, thisYear] = getCurrentMonthYear();
        const monthDoc = doc(monthCollectionRef, [thisMonth, thisYear].join("_"));

        // create document for current month, containing initial summary info
        const categoryTotals: { [key: string]: number } = {}

        for (const cat in categories) {
            categoryTotals[cat] = 0;
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

export function useCategories(user: User | null): Category[] | null {

    const [categories, setCategories] = useState<Category[] | null>(null);

    useEffect(() => {
        if (user) {
            const db = getFirestore();
            const userRef = doc(db, usersDirectory, user.uid);
            const categoriesRef = collection(userRef, "Categories");

            const categoryQuery = query(categoriesRef);
            const unsubscribe = onSnapshot(categoryQuery, (snapshot) => {
                const newCategories: Category[] = [];
                snapshot.forEach((doc) => {
                    newCategories.push(doc.data() as Category);
                });
                setCategories(newCategories);
            });

            return () => unsubscribe();
        }
    }, [user]);

    return categories;
}


export async function addOrUpdateExpense(user: User | null, expense: ExpenseClass) {
    // TODO update. Should be `addOrUpdateExpense` and handle both cases
    // this function sends an expense to firebase
    // this function is not reactive. It is used to send a single expense to firebase
    if (user?.uid) {
        const db: Firestore = getFirestore();
        const expenseObject = expense.toJson();

        try {
            // get reference to expense's month
            const monthString = createMonthYearString(expense.month, expense.year);
            const monthRef = doc(db, usersDirectory, user.uid, "Months", monthString);

            // Fetch the document from Firestore to check if it exists
            const expenseRef = doc(monthRef, "Expenses", expense.id);
            const expenseDoc = await getDoc(expenseRef);

            // UPDATE EXPENSE
            if (expenseDoc.exists()) {
                // Update the existing document
                await updateDoc(expenseRef, {
                    name: expense.name,
                    amount: expense.amount,
                    category: expense.categoryID,
                });
                
                console.log(`Expense document updated with ID: ${expense.id}`);
                // TODO: account for an expense changing amounts or categories

            // ADD NEW EXPENSE
            } else {
                // create and write an expense document with the generated ID
                await setDoc(expenseRef, expenseObject);
                console.log("Expense document added with ID: ", expenseRef.id);

                // update this month's total spent and category total
                const monthDoc = await getDoc(monthRef);
                if (!monthDoc.exists()) {
                    console.log("Creating summary doc... ", monthString)
                    await createCurrentMonth(db, user, defaultCategoriesAndIcons);
                }
                await updateDoc(monthRef, {
                    monthTotal: increment(expense.amount),
                    ["categoryTotals." + expense.categoryID]: increment(expense.amount)
                });
            }
            
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}


export async function getMonthSummary(user: User | null, month?: string): Promise<MonthSummary> {
    /**
     This function retrieves the current month's summary
     data for a specific user from the Firestore database.
     The summary is expected to be stored in a specific path based
     on the user's unique identifier (UID) and the current month.
     */
    if (user?.uid) {
        const db = getFirestore();

        const [thisMonth, thisYear] = getCurrentMonthYear();
        const monthString = month ? month : [thisMonth, thisYear].join("_");

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


export async function addCategory(user: User | null, category: Category, isMonthly: boolean = false) {
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
        // const isMonthly = true;
        const newCategory = new CategoryClass(category.categoryID, category.icon, category.amount, isMonthly);
        const budgetsRef = collection(userRef, "Budgets");
        const budgetRef = doc(budgetsRef, category.categoryID);
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

export function useSummary(user: User | null, month?: number, year?: number): MonthSummary | undefined {
    const [summary, setSummary] = useState<MonthSummary>();
    useEffect(() => {
        if (user) {
            const db = getFirestore();
            const userRef = doc(db, usersDirectory, user.uid);
    
            // get month summary from Month's document
            const [thisMonth, thisYear] = getCurrentMonthYear();
            const monthString = month && year ? createMonthYearString(month, year) : [thisMonth, thisYear].join("_");
    
            const unsubscribe = onSnapshot(doc(userRef, "Months", monthString), (doc) => {
                setSummary(doc.data() as MonthSummary);
            });

            return () => {
                unsubscribe();
            }
        } 
    });

    return summary;
}

export function useExpenses(user: User | null,monthly?: boolean, month?: number, year?: number ): Expense[] | [] {
    /**
     * this function is the hook version of the `getExpenses` function above.
     * Instead of doing it once, it will listen for changes and update accordingly.
     */

    const [expenses, setExpenses] = useState<Expense[]>([]);


    useEffect(() => {
        if (user) {
            const db = getFirestore();
            const userRef = doc(db, usersDirectory, user.uid);
            
            const [thisMonth, thisYear] = getCurrentMonthYear();
            const monthString = month && year ? createMonthYearString(month, year) : [thisMonth, thisYear].join("_");

            // get this month's expenses from Expenses collection
            const expensesRef = collection(userRef, "Months", monthString, "Expenses");
            const expensesQuery = query(expensesRef, orderBy("date", "desc"));

            const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
                const newExpenses: Expense[] = [];
                snapshot.forEach((doc) => {
                    if (doc.id !== "summary") {
                        const expenseData = doc.data() as Expense;
                        // console.log("monthly: ", expenseData.name, expenseData.is_monthly)
                        if (expenseData.date instanceof Timestamp) {
                            // const date: Date = expenseData.date.toDate();
                            expenseData.date = expenseData.date.toDate();
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
                // console.log("new expenses: ", newExpenses)
            });

            return () => {
                unsubscribe();
            }
        }
    }, [user, month, year, monthly]);

    return expenses;
}

// get function for analysis page
// not a hook
export async function getMonthMetadata(user: User | null, month?: number, year?: number): Promise<[Category[], MonthSummary]> {
    if (user) {
        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);

        // get budget info from Categories collection
        const categoriesRef = collection(userRef, "Categories");
        const categories: Category[] = [];

        const categoryDocs = await getDocs(categoriesRef); 
        categoryDocs.forEach((doc) => {
            categories.push(doc.data() as Category);
        });
    
        // get month summary from Month's document
        const [thisMonth, thisYear] = getCurrentMonthYear();
        const monthString = month && year ? createMonthYearString(month, year) : [thisMonth, thisYear].join("_");

        const monthRef = await getDoc(doc(userRef, "Months", monthString));
        const monthSummary = monthRef.data() as MonthSummary;

        return [categories, monthSummary];
    } else {
        throw new Error("Error getting month metadata")
    }
}

// TODO: user document should no longer store category info
export async function getUserCategories(user: User | null): Promise<string[]> {
    // get category names only (stored as part of User document)
    if (user?.uid) {
        const db = getFirestore();

        const userRef = doc(db, usersDirectory, user.uid);

        const categoriesQuery = query(collection(userRef, "Categories"));
        const categoriesSnap = await getDocs(categoriesQuery);
          
        const categories: string[] = [];

        categoriesSnap.forEach((doc) => {
            categories.push(doc.data().name);
        })

        // if no data from Categories collection, check if user has categories stored in user document
        // TODO: remove this once all users have updated to new format
        if (categories.length == 0) {
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && userSnap.data()?.categories) {
                return Object.keys(userSnap.data()["categories"]);
            }
        }
        
        return categories;
    }

    return ["Error returning categories"];
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
                    const goalData = doc.data();
                    goalData.goal_date = goalData.goal_date.toDate();

                    goals.push(goalData as Goal);
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

function getCurrentMonthYear(): [string, string] {
    // helper function to return the name of the current month's collection
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth returns month index starting from 0

    return [currentMonth.toString(), currentYear.toString()];
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