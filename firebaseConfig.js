import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxSJ8AGk9Kqf9I6gE1ObDgKEAl6GqdgO4",
  authDomain: "gift-16723.firebaseapp.com",
  databaseURL: "https://gift-16723-default-rtdb.firebaseio.com",
  projectId: "gift-16723",
  storageBucket: "gift-16723.firebasestorage.app",
  messagingSenderId: "634980572744",
  appId: "1:634980572744:web:2178bbdc623fc5d4a3027d",
  measurementId: "G-0XMRC1TFRL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);

export {
  app,
  auth,
  firestore,
  database,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  ref,
  set,
};
