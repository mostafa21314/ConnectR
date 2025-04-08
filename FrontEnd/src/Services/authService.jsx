// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../Services/firebase";

// Register a new user
export const registerUser = async (email, password, fullName, username) => {
  // Create user with email and password (Firebase Authentication)
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile with display name
  await updateProfile(user, {
      displayName: fullName
  });

  // Store additional user data in Firestore
  await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      fullName,
      username,
      createdAt: serverTimestamp(),
      role: "applicant" // You can adjust roles as needed for your HR app
  });

  return user;
};

// Sign in existing user
export const loginUser = async (username, password) => {
  // First, try to find the user by their username in Firestore
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
      throw new Error("Invalid username or password");
  }

  // If a user with the username is found, get their email
  let userEmail;
  querySnapshot.forEach((doc) => {
      userEmail = doc.data().email;
  });

  // Now, use the email and provided password to sign in with Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
  return userCredential.user;
};

// Sign out user
export const logoutUser = async () => {
  return signOut(auth);
};

// Get current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser;
};