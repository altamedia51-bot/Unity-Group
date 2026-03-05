
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * INSTRUKSI:
 * Ganti isi variabel firebaseConfig di bawah ini dengan kode 
 * yang Anda copy dari Firebase Console (Langkah 3 di atas).
 */
const firebaseConfig = {
  apiKey: "AIzaSyAU6xdw84Xdu4tYrqT7Hj2zheCdIZyVWwE",
  authDomain: "unitigroup.firebaseapp.com",
  projectId: "unitigroup",
  storageBucket: "unitigroup.firebasestorage.app",
  messagingSenderId: "238758531323",
  appId: "1:238758531323:web:c85add4d1b32f12f16e05e",
  measurementId: "G-5BHZF0GNBP"
};

// Inisialisasi Firebase (Compat Mode for Auth support)
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Use compat auth instance
const db = getFirestore(app); // Use modular firestore instance
const storage = getStorage(app); // Use modular storage instance

export { auth, db, storage };
