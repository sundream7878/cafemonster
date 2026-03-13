import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'admin' | 'buyer' | null;

interface AuthContextType {
    user: User | null;
    email: string | null;
    role: UserRole;
    loading: boolean;
    logout: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    email: null,
    role: null,
    loading: true,
    logout: async () => { },
    refreshRole: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    const checkRole = async (userEmail: string) => {
        try {
            console.log(`🔍 Checking role for: ${userEmail}`);
            const adminDoc = await getDoc(doc(db, 'admins', userEmail.toLowerCase()));
            const isAdm = adminDoc.exists();
            console.log(`📊 Role result: ${isAdm ? 'admin' : 'buyer'}`);
            return isAdm ? 'admin' : 'buyer';
        } catch (error) {
            console.error('❌ Error checking admin role:', error);
            return 'buyer';
        }
    };

    const registerUser = async (uid: string, userEmail: string) => {
        try {
            const emailKey = userEmail.toLowerCase();
            await setDoc(doc(db, 'users', uid), {
                email: emailKey,
                lastLoginAt: serverTimestamp()
            }, { merge: true });
            console.log(`👤 User mapping saved: ${uid} -> ${emailKey}`);
        } catch (error: any) {
            console.error('❌ Error registering user mapping:', error);
        }
    };

    const refreshRole = async () => {
        const userEmail = localStorage.getItem('user_email');
        if (userEmail && auth.currentUser) {
            const detectedRole = await checkRole(userEmail);
            setRole(detectedRole);
            setEmail(userEmail.toLowerCase());
            await registerUser(auth.currentUser.uid, userEmail);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userEmail = localStorage.getItem('user_email');
                if (userEmail) {
                    const detectedRole = await checkRole(userEmail);
                    setRole(detectedRole);
                    setEmail(userEmail.toLowerCase());
                    await registerUser(firebaseUser.uid, userEmail);
                } else {
                    setRole('buyer');
                    setEmail(null);
                }
                setUser(firebaseUser);
            } else {
                setUser(null);
                setEmail(null);
                setRole(null);
                localStorage.removeItem('user_email');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        localStorage.removeItem('user_email');
        localStorage.removeItem('buyer_email');
        await signOut(auth);
    };

    const value = {
        user,
        email,
        role,
        loading,
        logout,
        refreshRole
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
