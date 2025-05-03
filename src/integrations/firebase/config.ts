import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "",
  authDomain: "fir-1-may.firebaseapp.com",
  projectId: "fir-1-may",
  storageBucket: "fir-1-may.appspot.com",
  messagingSenderId: "59748884454",
  appId: "",
  measurementId: "G-4K8K0H345B",
};

const app = initializeApp(firebaseConfig);

export default app;