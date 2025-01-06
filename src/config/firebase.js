// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAc5bLDyLlF3j8pHTpFnctGpLSrliNkJOA",
    authDomain: "letters-205e1.firebaseapp.com",
    projectId: "letters-205e1",
    storageBucket: "letters-205e1.firebasestorage.app",
    messagingSenderId: "961205302180",
    appId: "1:961205302180:web:8026485fb23f3b5ba10731",
    measurementId: "G-B85S80PGZ6"
};


// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Add connection state handling
const handleConnectionState = () => {
  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      console.log('Connected to Firebase');
    } else {
      console.log('Disconnected from Firebase');
    }
  });
};

// Export instances
export { app, auth, db, handleConnectionState };

// Optional: Add error handling for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in');
  } else {
    console.log('User is signed out');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});