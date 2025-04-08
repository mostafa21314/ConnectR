// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDpeLnkZ0f9iUCHWRPouGGhepOhNiO2bPo",
//   authDomain: "connectr-4eb4b.firebaseapp.com",
//   projectId: "connectr-4eb4b",
//   storageBucket: "connectr-4eb4b.firebasestorage.app",
//   messagingSenderId: "203190041520",
//   appId: "1:203190041520:web:00920d401184107ef8b475",
//   measurementId: "G-W8CDDLSH98"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// // Initialize Firebase services
// const auth = getAuth(app);
// const db = getFirestore(app);
// // Export the services
// // export { auth };
// // export default firebaseApp;
// export { auth, db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Uncomment if you need analytics
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Uncomment if you need analytics

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services
export { auth, db };
export default app;