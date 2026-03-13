import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from './lib/firebase';

const ADMINS = [
    'chiu01@naver.com',
    'sundream7878@gmail.com'
];

export async function bootstrapAdmins() {
    try {
        // Ensure we are signed in before writing (Rules usually require auth)
        if (!auth.currentUser) {
            console.log('🔑 No user found, signing in anonymously for bootstrap...');
            await signInAnonymously(auth);
        }

        console.log('🚀 Starting admin bootstrap...');
        for (const email of ADMINS) {
            const emailKey = email.toLowerCase();
            await setDoc(doc(db, 'admins', emailKey), {
                email: emailKey,
                addedAt: serverTimestamp()
            });
            console.log(`✅ Admin added to Firestore: ${emailKey}`);
        }
        console.log('✨ Admin bootstrap complete.');
    } catch (error: any) {
        console.error('❌ Firestore Bootstrap Error:', error);
        if (error.code === 'permission-denied') {
            console.error('👉 Tip: Check your Firestore Security Rules. You might not have permission to write to the "admins" collection.');
        }
    }
}
