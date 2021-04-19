import firebase from "firebase/app";
import "firebase/auth";
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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export async function googleLogin() {
  console.log("running 1");
  const provider = new firebase.auth.GoogleAuthProvider();
  console.log("running 2");
  const res = await firebase
    .auth()
    .signInWithPopup(provider)
    .then(() => {
      return "success";
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
      return ref.docs.map((doc) => {
        console.log("returning tasks");
        return doc.data();
      });
    });
}

export async function getTask(id) {
  return await db
    .collection("tasks")
    .doc(id)
    .get("server")
    .then((doc) => {
      console.log("returning data ");
      return doc.data();
    });
}

export async function logout() {
  return await firebase
    .auth()
    .signOut()
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export function getUser() {
  return firebase.auth().currentUser;
}
