// src/services/authService.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile 
  } from "firebase/auth";
  import { doc, setDoc, serverTimestamp } from "firebase/firestore";
  import { auth, db } from "../firebase";
  
  // Register a new user
  export const registerUser = async (email, password, fullName, username) => {
    try {
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
    } catch (error) {
      throw error;
    }
  };
  
  // Sign in existing user
  export const loginUser = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  // Sign out user
  export const logoutUser = async () => {
    return signOut(auth);
  };
  
  // Get current authenticated user
  export const getCurrentUser = () => {
    return auth.currentUser;
  };
  