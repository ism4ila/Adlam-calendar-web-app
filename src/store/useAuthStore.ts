import { create } from 'zustand';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthStore {
  user: User | null;
  isPremium: boolean;
  premiumSince: Date | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  listenToAuth: () => () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isPremium: false,
  premiumSince: null,
  isLoading: true,

  signInWithGoogle: async () => {
    if (!auth || !db) return;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isPremium: false,
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  },

  signOut: async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      set({ user: null, isPremium: false, premiumSince: null });
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  },

  listenToAuth: () => {
    if (!auth || !db) {
      set({ user: null, isPremium: false, premiumSince: null, isLoading: false });
      return () => {};
    }

    let unsubFirestore: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }

      if (user) {
        set({ user, isLoading: true });
        unsubFirestore = onSnapshot(doc(db!, 'users', user.uid), (snap) => {
          const data = snap.data();
          set({
            isPremium: data?.isPremium === true,
            premiumSince: data?.premiumSince?.toDate?.() ?? null,
            isLoading: false,
          });
        });
      } else {
        set({ user: null, isPremium: false, premiumSince: null, isLoading: false });
      }
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  },
}));
