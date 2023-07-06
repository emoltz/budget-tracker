import {createContext, useContext, useEffect, useState} from "react";
import {auth} from '@/lib/firebase';
import {getAuth, onAuthStateChanged} from 'firebase/auth';

export const AuthContext = createContext();

//provider
export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}