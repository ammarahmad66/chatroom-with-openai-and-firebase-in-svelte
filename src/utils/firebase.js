import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyCeVTSJn_HFtOsNjxyFpFpL4Tzs8Uiohfw",
  authDomain: "svelte-test-45e2a.firebaseapp.com",
  projectId: "svelte-test-45e2a",
  storageBucket: "svelte-test-45e2a.appspot.com",
  messagingSenderId: "465624185423",
  appId: "1:465624185423:web:b2ab0de2555ed31ee6083a"
});

// Initialize Firebase


export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app)