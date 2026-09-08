'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'sonner';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'cliente' | 'admin';
  phone?: string;
  createdAt?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('admin_token', token);
          localStorage.setItem('cabo_car_user', JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'Usuário'
          }));

          // Try fetching extra profile info from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data() as UserProfile;
              setUserProfile(data);
            } else {
              // Create basic profile if not exists
              const basicProfile: UserProfile = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
                email: firebaseUser.email || '',
                role: firebaseUser.email?.includes('admin') || firebaseUser.email?.includes('cabocar') ? 'admin' : 'cliente',
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...basicProfile,
                createdAt: serverTimestamp(),
              });
              setUserProfile(basicProfile);
            }
          } catch (profileErr) {
            console.warn('Firestore profile lookup error, falling back to basic info:', profileErr);
            setUserProfile({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Usuário',
              email: firebaseUser.email || '',
              role: firebaseUser.email?.includes('admin') ? 'admin' : 'cliente',
            });
          }
        } catch (err) {
          console.error('Error handling auth state change:', err);
        }
      } else {
        setUserProfile(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('cabo_car_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;
      const token = await loggedUser.getIdToken();
      localStorage.setItem('admin_token', token);
      toast.success('Login realizado com sucesso!', {
        description: `Bem-vindo, ${loggedUser.displayName || loggedUser.email}!`
      });
    } catch (err: any) {
      console.error('SignIn error:', err);
      let msg = 'Erro ao fazer login. Verifique seus dados.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      }
      toast.error('Falha no login', { description: msg });
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, phone?: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Update Firebase Auth Display Name
      await updateProfile(newUser, { displayName: name });

      // Save user to Firestore 'users' collection
      const newProfile: UserProfile = {
        uid: newUser.uid,
        name: name,
        email: email,
        phone: phone || '',
        role: email.includes('admin') || email.includes('cabocar') ? 'admin' : 'cliente',
      };

      try {
        await setDoc(doc(db, 'users', newUser.uid), {
          ...newProfile,
          createdAt: serverTimestamp(),
        });
      } catch (firestoreErr) {
        console.warn('Could not write user to firestore, auth succeeded:', firestoreErr);
      }

      setUserProfile(newProfile);
      const token = await newUser.getIdToken();
      localStorage.setItem('admin_token', token);

      toast.success('Conta criada com sucesso!', {
        description: `Bem-vindo à Cabo Car Multimarcas, ${name}!`
      });
    } catch (err: any) {
      console.error('SignUp error:', err);
      let msg = 'Erro ao criar conta. Tente novamente.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está em uso.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha deve ter no mínimo 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      }
      toast.error('Falha no cadastro', { description: msg });
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('cabo_car_user');
      setUser(null);
      setUserProfile(null);
      toast.success('Você desconectou da sua conta.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isAdmin = userProfile?.role === 'admin' || user?.email?.includes('admin') || false;

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
