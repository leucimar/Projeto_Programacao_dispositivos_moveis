import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCU6hNWWTjzMrWen-MbcC9li4ZpzCY-eGg",
  authDomain: "tinder-de-peladas01.firebaseapp.com",
  projectId: "tinder-de-peladas01",
  storageBucket: "tinder-de-peladas01.firebasestorage.app",
  messagingSenderId: "308504756904",
  appId: "1:308504756904:web:b7dae1160ccc1cb54a389d",
  measurementId: "G-PLH7DPJN7N"
};

// Inicializa o App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

if (Platform.OS === 'web') {
  // Configuração limpa para Web
  auth = getAuth(app);
  setPersistence(auth, browserLocalPersistence);
} else {
  // Configuração para Mobile (Android/iOS)
  const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    auth = getAuth(app);
  }
}

const db: Firestore = getFirestore(app);

export { auth, db };