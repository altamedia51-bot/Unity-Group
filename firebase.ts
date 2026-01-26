import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PERHATIAN: Ganti konfigurasi di bawah ini dengan konfigurasi dari Firebase Console Anda
const firebaseConfig = {
  apiKey: "API_KEY_ANDA_DISINI",
  authDomain: "unity-group-project.firebaseapp.com",
  projectId: "unity-group-project",
  storageBucket: "unity-group-project.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
// Kita tambahkan try-catch agar aplikasi tidak crash jika config belum diisi (untuk demo UI)
let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.warn("Firebase belum dikonfigurasi dengan benar. UI akan berjalan dalam mode simulasi.");
}

export { auth, db };