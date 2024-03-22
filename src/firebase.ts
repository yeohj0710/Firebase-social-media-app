import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9CrbgL6FmJIUYy4CL7Ps3NIEelnMASjE",
  authDomain: "yeohj0710x.firebaseapp.com",
  projectId: "yeohj0710x",
  storageBucket: "yeohj0710x.appspot.com",
  messagingSenderId: "1070119465029",
  appId: "1:1070119465029:web:c21ac2cbe88da79c5e732c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
