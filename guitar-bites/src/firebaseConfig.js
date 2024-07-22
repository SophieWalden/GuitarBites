// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoSXlRk4mk904k-pdmCApB7wLBO6r2WkI",
  authDomain: "guitarbites-775e5.firebaseapp.com",
  projectId: "guitarbites-775e5",
  storageBucket: "guitarbites-775e5.appspot.com",
  messagingSenderId: "755234165563",
  appId: "1:755234165563:web:f9aa2cc514af615b2b1d1e",
  measurementId: "G-BP0SWV4EF7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
