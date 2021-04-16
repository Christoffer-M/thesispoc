import firebase from "firebase/app";
import "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export async function googleLogin() {
  console.log("Why hello there");

  const provider = new firebase.auth.GoogleAuthProvider();

  const res = await firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...

      return [{ result: "success", userObject: user }];
    })
    .catch((error) => {
      return [{ result: "error", message: error.message, code: error.code }];
    });

  return res;
}

export async function getEmployees() {
  return await db
    .collection("employee")
    .get()
    .then((ref) => {
      return ref.docs.map((doc) => doc.data());
    });
}

export async function getTasks() {
  return await db
    .collection("tasks")
    .get()
    .then((ref) => {
      return ref.docs.map((doc) => doc.data());
    });
}
