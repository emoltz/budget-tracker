import { createContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  user: User | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

//provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
