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
      console.log(ref.docs);
      return ref.docs.map((doc) => {
        return { id: doc.id, data: doc.data() };
      });
    });
}

export async function getEmployee(id) {}

export async function getUserTasks() {
  return await db
    .collection("tasks")
    .get()
    .then((ref) => {
      let arr = [];
      ref.docs.forEach((doc) => {
        console.log("returning tasks");
        if (doc.data().assigned !== undefined) {
          arr.push(doc.data());
        }
      });
      return arr;
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

export function addTask(description, helpneeded, name, assigned) {
  db.collection("tasks")
    .doc()
    .set({
      description: description,
      helpneeded: helpneeded,
      name: name,
      assigned: assigned,
      progress: 0,
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}
