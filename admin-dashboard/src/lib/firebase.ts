import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ WARNING: DO NOT PUT SERVICE ACCOUNT KEYS HERE! ⚠️
// You pasted a Service Account Key (private_key) which is for the SERVER only.
// This is a CLIENT (React) app, so you must use the "Web App" configuration.
//
// 1. Go to Firebase Console -> Project Settings
// 2. Scroll down to "Your apps"
// 3. Select the Web App (</>)
// 4. Copy the "firebaseConfig" object (apiKey, authDomain, projectId, etc.)
// 5. Paste it below:

const firebaseConfig = {
    apiKey: "AIzaSyDv8-JlxdcPV_s39Sf0qM9brX8ZH3YpIAs",
    authDomain: "n-place-db.firebaseapp.com",
    projectId: "n-place-db",
    storageBucket: "n-place-db.firebasestorage.app",
    messagingSenderId: "1054494410598",
    appId: "1:1054494410598:web:282d9a7db4dd9ff284eaa7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
