// src/contexts/FirebaseContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { enableNetwork, disableNetwork } from 'firebase/firestore';

const FirebaseContext = createContext();

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    const handleOnline = () => {
      setIsOnline(true);
      enableNetwork(db).catch(console.error);
    };

    const handleOffline = () => {
      setIsOnline(false);
      disableNetwork(db).catch(console.error);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Usando ref e onValue
const dbRef = ref(database, 'path/to/data');
onValue(dbRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
});

  const value = {
    user,
    loading,
    isOnline,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
}