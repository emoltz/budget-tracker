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
    getDocs,
    getFirestore,
    increment,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    deleteDoc,
    where,
} from 'firebase/firestore';
import {
    Budget,
    BudgetClass,
    Category,
    CategoryBudget,
    CategoryClass,
    CustomButton,
    Expense,
    ExpenseClass,
    Goal, GoalClass,
    MonthSummary
} from "./Interfaces";
import {useEffect, useState} from "react";
import {Timestamp} from "@firebase/firestore";
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

    // create collection for the current month and summary document for current month
    // this will need to happen for each new month >> write into addExpense (if currMonth doc doesn't exist, create it)
    await createCurrentMonthSummary(db, user);

    const budgetsCollectionRef = collection(db, usersDirectory, uid, "Budgets");

    // create budgets for each category
    const default_budgets: BudgetClass[] = [
        new BudgetClass("Food", 0),
        new BudgetClass("Groceries", 0),
        new BudgetClass("Activities", 0),
        new BudgetClass("Housing", 0),
        new BudgetClass("Transportation", 0),
        new BudgetClass("Medical & Healthcare", 0),
        new BudgetClass("Personal Spending", 0)
    ];
    // create and write a document with the generated ID
    for (const budgetClass of default_budgets) {
        const budgetObject: Budget = budgetClass.toObject();
        const budget_id = budgetClass.id; // Ensure this ID is generated correctly
        const budgetDocRef = doc(budgetsCollectionRef, budget_id); // Reference to the document with ID "budget_id"
        await setDoc(budgetDocRef, budgetObject); // Use the budget_id as the document ID
    }

    // create goals collection and goals summary
    const goalsRef = collection(db, usersDirectory, uid, "Goals");
    const goalSummary = doc(goalsRef, "summary")
    await setDoc(goalSummary, { numGoals: 0 })

}


async function createCurrentMonthSummary(db: Firestore, user: User | null) {
    // This is a helper function to create a new month summary document.
    //  Called when user is first created, or if current summary is not found
    //  (i.e. it's a new month - getCurrentSummary, useCategoryBudgets) 
    if (user?.uid) {
        const monthRef = collection(db, usersDirectory, user.uid, getCurrentMonthString());
        const summaryRef = doc(monthRef, "summary");

        // create summary document for current month
        const initialSummary: MonthSummary = {
            month: new Date().getMonth() + 1, // getMonth returns month index starting from 0,
            year: new Date().getFullYear(),
            monthTotal: 0,
            categoryTotals: {
                "FoodTotal": 0,
                "GroceriesTotal": 0,
                "ActivitiesTotal": 0,
                "HousingTotal": 0,
                "Transportation": 0,
                "Medical & HealthcareTotal": 0,
                "Personal SpendingTotal": 0,
            }
        }

        await setDoc(summaryRef, initialSummary);
    } else {
        throw new Error("User not found (create month summary)");
    }
}


export async function sendExpenseToFirebase(user: User | null, expense: ExpenseClass) {
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


export async function addMonthlyExpense(user: User | null, expense: Expense) {
    // check if expense is monthly
    if (!expense.is_monthly) {
        console.warn(`Expense ${expense.id} is not monthly`)
        return;
    }

    if (user) {
        const db = getFirestore();
        try {
            // get reference to current month
            const currentMonth = createMonthYearString(expense.month, expense.year);
            const userRef = doc(db, usersDirectory, user.uid);
            const expensesRef = collection(userRef, currentMonth);
            const expenseRef = doc(expensesRef, expense.id);

            // add doc
            await setDoc(expenseRef, expense);
            console.log(`Expense document written with ID: ${expense.id}`);

        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}


export async function updateExpense(user: User | null, expense: Expense) {
    if (user) {
        const db = getFirestore();
        const currentMonth = createMonthYearString(expense.month, expense.year);
        const userRef = doc(db, usersDirectory, user.uid);
        const expensesRef = collection(userRef, currentMonth);
        const expenseRef = doc(expensesRef, expense.id);

        // Fetch the document from Firestore to check if it exists
        const expenseDoc = await getDoc(expenseRef);

        if (expenseDoc.exists()) {
            // Update the existing document
            await updateDoc(expenseRef, {
                name: expense.name,
                amount: expense.amount,
                category: expense.category,
            });
            console.log(`Expense document updated with ID: ${expense.id}`);
        } else {
            // Add a new document
            console.log(`Monthly expense added because no document was found. ID: ${expense.id}`)
            await addMonthlyExpense(user, expense)
        }
    } else {
        throw new Error("User not found: updateExpense function failed.");
    }
}


export async function getCurrentSummary(user: User | null): Promise<MonthSummary> {
    /**
     This function retrieves the current month's summary
     data for a specific user from the Firestore database.
     The summary is expected to be stored in a specific path based
     on the user's unique identifier (UID) and the current month.
     */
    if (user?.uid) {
        const db = getFirestore();
        const monthCollection = getCurrentMonthString();

        const monthRef = collection(doc(collection(db, usersDirectory), user.uid), monthCollection);

        const summaryDoc = await getDoc(doc(monthRef, "summary"));

        if (!summaryDoc.exists()) {
            console.log("Month summary does not exist; creating:", monthCollection);
            await createCurrentMonthSummary(db, user);
            // throw new Error("Month summary does not exist");
        }
        return summaryDoc.data() as MonthSummary;
    } else {
        throw new Error("User not found (get current summary")
    }
}

export async function getCategories(user: User | null): Promise<{ [key: string]: string }> {
    if (user) {
        // get category dictionary from User document
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
        throw new Error("User not found (get categories)")
    }

}

function consolidateBudgetAndCategory(category: string, icon: string, budgetAmount: number, spent: number): CategoryBudget {
    return {
        category: category,
        icon: icon,
        budgetAmount: budgetAmount,
        spent: spent
    };
}

export async function getCategoryBudgets(user: User | null): Promise<CategoryBudget[]> {
    // TODO: rename this `getBudgets` and just have it grab icon from categories
    if (user) {
        // first, get the user's categories
        const categories = await getCategories(user);
        // then, get the user's budgets
        const db = getFirestore();
        const budgetsCollectionRef = collection(db, usersDirectory, user.uid, "Budgets");
        const budgetsSnapshot = await getDocs(budgetsCollectionRef);
        const budgets: Budget[] = [];
        budgetsSnapshot.forEach((doc) => {
            budgets.push(doc.data() as Budget);
        });

        // get summary
        const summary: MonthSummary = await getCurrentSummary(user);

        // finally, consolidate the two into a list of CategoryBudgets
        const categoryBudgets: CategoryBudget[] = [];
        for (const budget of budgets) {
            const category = budget.category_name;
            const icon = categories[category];
            const budgetAmount = budget.amount;
            const spent = summary.categoryTotals[category + "Total"]
            categoryBudgets.push(consolidateBudgetAndCategory(category, icon, budgetAmount, spent));
        }


        // console.log(categoryBudgets)
        return categoryBudgets;

    } else {
        throw new Error("User not found");
    }
}

export const useCategoryBudgets_currentMonth = (user: User | null): CategoryBudget[] => {
    /**
     * This function is a React hook that returns the current month's
     * categorybudgets for a specific user from the Firestore database.
     * This differes from getCategories insofar as it is reactive: i.e. it does not get the data once but listens for changes in the data.
     * This function is expected to be called from a React component.
     * TODO make this function for a more generic use case
     */
    const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[] | null>(null);

    useEffect(() => {
        if (user) {
            const db = getFirestore();
            const budgetsCollectionRef = collection(db, usersDirectory, user.uid, "Budgets");

            const monthCollection = getCurrentMonthString();
            const monthRef = collection(doc(collection(db, usersDirectory), user.uid), monthCollection);
            const summaryDocRef = doc(monthRef, "summary");


            const fetchAndUpdate = async () => {
                // console.log('Fetching and updating data...');

                const budgetsSnapshot = await getDocs(budgetsCollectionRef);
                const summaryDoc = await getDoc(doc(monthRef, "summary"));
                if (!summaryDoc.exists()) {
                    console.log("Creating summary doc... ", monthCollection)
                    await createCurrentMonthSummary(db, user);
                }
                const summary: MonthSummary = summaryDoc.data() as MonthSummary;
                // console.log("Summary: ", summary)

                const budgets: Budget[] = [];
                budgetsSnapshot.forEach((doc) => {
                    budgets.push(doc.data() as Budget);
                });

                const categories = await getCategories(user);

                const updatedCategoryBudgets: CategoryBudget[] = [];
                for (const budget of budgets) {
                    const category = budget.category_name;
                    const icon = categories[category];
                    const budgetAmount = budget.amount;
                    const spent = summary.categoryTotals[category + "Total"];
                    updatedCategoryBudgets.push(consolidateBudgetAndCategory(category, icon, budgetAmount, spent));
                }

                setCategoryBudgets(updatedCategoryBudgets);
            };

            const unsubscribeBudgets = onSnapshot(budgetsCollectionRef, fetchAndUpdate);
            const unsubscribeSummary = onSnapshot(summaryDocRef, fetchAndUpdate);


            // Unsubscribe from changes when the effect is cleaned up
            return () => {
                unsubscribeBudgets();
                unsubscribeSummary();
            };
        }
    }, [user]);
    if (categoryBudgets === null) {
        console.warn("Category budgets is null. See Firebase.tsx file")
        console.log(categoryBudgets)
        return [];
    }
    return categoryBudgets;
};


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


export async function getUserCategories(user: User | null): Promise<string[]> {
    // get category names only (stored as part of User document)
    if (user?.uid) {
        const db = getFirestore();

        const userRef = doc(db, usersDirectory, user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return Object.keys(userSnap.data()["categories"]);
        }
    }

    return ["Error returning categories"];
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


export async function getExpenses(user: User | null, month?: number, year?: number, monthly?: boolean): Promise<Expense[]> {
    /**
     *  this function returns a list of expenses for a given month and year
     *  if no month or year is given, it returns the current month's expenses
     */
    if (user) {
        let monthString: string;
        if (!month || !year) {
            monthString = getCurrentMonthString();
        } else {
            monthString = createMonthYearString(month, year);
        }

        const db = getFirestore();
        const userRef = doc(db, usersDirectory, user.uid);
        const expensesRef = collection(userRef, monthString);
        const expensesQuery = query(expensesRef, orderBy("date", "desc"))
        const expensesSnapshot = await getDocs(expensesQuery);
        const expenses: Expense[] = [];

        expensesSnapshot.forEach((doc) => {
            if (doc.id !== "summary") {
                // convert timestamp
                const expenseData = doc.data() as Expense;

                if (expenseData.date instanceof Timestamp) {
                    const date: Date = expenseData.date.toDate();
                    expenseData.date = date.toLocaleDateString();
                }

                // Logic to include or exclude entries based on `monthly` and `is_monthly`
                if (monthly === undefined || !monthly) {
                    if (!expenseData.is_monthly) {
                        expenses.push(expenseData);
                    }
                } else if (monthly) {
                    if (expenseData.is_monthly) {
                        expenses.push(expenseData);
                    }
                }
            }
        });

        return expenses;
    } else {
        throw new Error("User not found");
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
            const expensesRef = collection(userRef, getCurrentMonthString());
            const expensesQuery = query(expensesRef, orderBy("date", "desc"));

            const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
                const newExpenses: Expense[] = [];
                snapshot.forEach((doc) => {
                    if (doc.id !== "summary") {
                        const expenseData = doc.data() as Expense;

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


export async function deleteExpense(user: User | null, expense: Expense) {
    if (user) {
        const db = getFirestore();
        const monthYearString = createMonthYearString(expense.month, expense.year);
        const userRef = doc(db, usersDirectory, user.uid);
        const expensesRef = collection(userRef, monthYearString);
        const expenseRef = doc(expensesRef, expense.id);

        // Fetch the document from Firestore to check if it exists
        const expenseDoc = await getDoc(expenseRef);

        if (expenseDoc.exists()) {
            // Delete the existing document
            await updateDoc(expenseRef, {
                is_deleted: true
            });
            console.log(`Expense document deleted with ID: ${expense.id}`);
        } else {
            console.log("Expense document does not exist");
        }
    }
}

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
            await setDoc(doc(goalsRef, new_goal.id), new_goal.toObject());
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


export function useButtons(user: User | null): {buttons: CustomButton[], loading: boolean} {
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

// DEPRECATED FUNCTIONS

// noinspection JSCommentMatchesSignature
export async function saveUserToDatabase_deprecated(user: User) {
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
        return new CategoryClass(currentMonth, 0, name, currentYear, 0);
    });

    const categoriesRef = collection(db, 'Users', uid, 'Categories');
    for (const category of default_categories) {
        const categoryRef = doc(categoriesRef, category.id);
        await setDoc(categoryRef, category.toObject());
    }
}


export function useCategories_deprecated(user: User | null): Category[] {
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

async function saveExpenseToCategory_deprecated(user: User, expense: ExpenseClass) {
    /*
        The purpose of this function is to marry the expense to the category in firebase and keep a record of all expenses
        It's a helper function to `sendExpenseToFirebase`
        Note that it is not exported, so you can't use it anywhere else but this file.
     */
    if (user?.uid) {
        const db: Firestore = getFirestore();
        // const expenseObject = expense.toObject();
        try {
            const categoryIdentifier = expense.monthID;
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
            await saveExpenseToCategory_deprecated(user, expense);

            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}