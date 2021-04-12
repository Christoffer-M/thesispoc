import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCijJugovDjBgNJSQKUgGXglQjsVMxnNpI",
  authDomain: "thesispoc.firebaseapp.com",
  databaseURL:
    "https://thesispoc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "thesispoc",
  storageBucket: "thesispoc.appspot.com",
  messagingSenderId: "731475161269",
  appId: "1:731475161269:web:f4946fb643820d0b058efc",
  measurementId: "G-WBZ4MVRN4C",
};

let app;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
  console.log(app);
} else {
  app = firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();

export async function getEmployees() {
  return await db
    .collection("employee")
    .get()
    .then((ref) => {
      return ref.docs.map((doc) => doc.data());
    });
}
