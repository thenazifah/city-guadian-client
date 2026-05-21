import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { env } from "@/config/env";

let auth = null;

function getAppAuth() {
  if (!env.isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add VITE_FIREBASE_* variables to your .env file."
    );
  }

  if (!auth) {
    const app = initializeApp(env.firebase);
    auth = getAuth(app);
  }

  return auth;
}

export const googleProvider = new GoogleAuthProvider();

export async function registerWithEmail({ name, email, password, photoURL }) {
  const firebaseAuth = getAppAuth();
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );

  await updateProfile(credential.user, {
    displayName: name,
    photoURL: photoURL || null,
  });

  return credential.user.getIdToken();
}

export async function loginWithEmail(email, password) {
  const firebaseAuth = getAppAuth();
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password
  );
  return credential.user.getIdToken();
}

export async function loginWithGoogle() {
  const firebaseAuth = getAppAuth();
  const credential = await signInWithPopup(firebaseAuth, googleProvider);
  return credential.user.getIdToken();
}

export { getAppAuth };
