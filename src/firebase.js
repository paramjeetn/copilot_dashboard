import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQkXnBSwAwHyALPNHDg2WtKNwlnXl_9qI",
  authDomain: "copilot-dashboard-99ed0.firebaseapp.com",
  projectId: "copilot-dashboard-99ed0",
  storageBucket: "copilot-dashboard-99ed0.appspot.com",
  messagingSenderId: "719412475686",
  appId: "1:719412475686:web:82d90f3119916dc90bf3e7",
  measurementId: "G-0V32BDJXDX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, auth };