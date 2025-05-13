// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where, getDoc } from "firebase/firestore";
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

// Google Sign In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if this is a new user
  const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

  if (isNewUser) {
    // Store additional user data in Firestore for new users
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName,
      username: user.email.split('@')[0], // Creating simple username from email
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      role: "applicant",
      authProvider: "google"
    });
  } else {
    // Update existing user's last login
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    } else {
      // User exists in Auth but not in Firestore (rare case)
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName,
        username: user.email.split('@')[0],
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        role: "applicant",
        authProvider: "google"
      });
    }
  }

  return user;
};

// GitHub Sign In
export const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if this is a new user
  const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

  if (isNewUser) {
    // Store additional user data in Firestore for new users
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName || "GitHub User",
      username: user.email ? user.email.split('@')[0] : `github_${user.uid.substring(0, 8)}`,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      role: "applicant",
      authProvider: "github"
    });
  } else {
    // Update existing user's last login
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    } else {
      // User exists in Auth but not in Firestore (rare case)
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || "GitHub User",
        username: user.email ? user.email.split('@')[0] : `github_${user.uid.substring(0, 8)}`,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        role: "applicant",
        authProvider: "github"
      });
    }
  }

  return user;
};

// Facebook Sign In
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Handle new user data similar to Google/GitHub methods
  const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

  if (isNewUser) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName,
      username: user.email ? user.email.split('@')[0] : `fb_${user.uid.substring(0, 8)}`,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      role: "applicant",
      authProvider: "facebook"
    });
  } else {
    // Update last login
    await setDoc(doc(db, "users", user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });
  }

  return user;
};

// Sign out user
export const logoutUser = async () => {
  return signOut(auth);
};

// Get current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser;
};