import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_DATABASE_URL: databaseURL,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
  VITE_FIRESTORE_COLLECTION,
} = import.meta.env;

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  messagingSenderId,
  projectId,
  storageBucket,
} as FirebaseOptions;

const apps = getApps();
const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestoreCollection = collection(
  firestore,
  String(VITE_FIRESTORE_COLLECTION)
);
