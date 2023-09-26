import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDoDYv0oGKND3jdla6BWxpiaJadXuyizCk",
  authDomain: "pioneer-constructions.firebaseapp.com",
  projectId: "pioneer-constructions",
  storageBucket: "pioneer-constructions.appspot.com",
  messagingSenderId: "577939507904",
  appId: "1:577939507904:web:4d32cd63f247d82de2bb25",
  measurementId: "G-CCVBLTH8RG",
};

const erpFirebase = initializeApp(firebaseConfig);
export const erpFirebaseAuth = getAuth(erpFirebase);
export const erpFirestore = getFirestore(erpFirebase);
export const erpStorage = getStorage(erpFirebase);
