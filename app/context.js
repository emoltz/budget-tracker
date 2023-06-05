import {createContext, useContext, useEffect, useState} from "react";
import {auth } from '@/lib/firebase';

export const AuthContext = createContext();

//provider
export function AuthProvider({ children }){
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( (user) => {
            if(user){
                setUser(user);
            }
            else{
                setUser(null);
            }
        });
        return () => unsubscribe();


    }, []);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    )

}

export function useAuth() {
    return useContext(AuthContext);
}