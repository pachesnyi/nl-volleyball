"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log('🔑 Starting Google sign in...');
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google sign in successful:', result.user.email);
      await handleUserLogin(result.user);
    } catch (error: unknown) {
      console.error("❌ Error signing in with Google:", error);
      
      const authError = error as { code?: string; message?: string };
      
      if (authError.code === 'auth/configuration-not-found') {
        console.error('Firebase Auth configuration not found. Please check:');
        console.error('1. Firebase project has Authentication enabled');
        console.error('2. Google provider is configured');
        console.error('3. Web app is properly registered');
        alert('Authentication not configured. Please check Firebase setup.');
      } else if (authError.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
      } else {
        alert(`Sign in failed: ${authError.message || 'Unknown error'}`);
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const handleUserLogin = async (firebaseUser: FirebaseUser) => {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUser(userData);
      } else {
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email!,
          role: "guest",
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date(),
        };

        await setDoc(userDocRef, {
          ...newUser,
          createdAt: new Date().toISOString(),
        });

        setUser(newUser);
      }
    } catch (error) {
      console.error("Error handling user login:", error);
      // If Firestore fails, still set basic user info from Firebase Auth
      const basicUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || firebaseUser.email!,
        role: "guest",
        photoURL: firebaseUser.photoURL || undefined,
        createdAt: new Date(),
      };
      setUser(basicUser);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        await handleUserLogin(firebaseUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [isHydrated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
