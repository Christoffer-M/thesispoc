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
  const provider = new firebase.auth.GoogleAuthProvider();
  const res = await firebase
    .auth()
    .signInWithPopup(provider)
    .then((res) => {
      // const storage = firebase.storage();
      // const imageReference = storage.refFromURL(res.user.photoURL);
      // console.log(imageReference);
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
        if (doc.data().assigned === getUser().uid) {
          arr.push(doc.data());
        }
      });
      return arr;
    })
    .catch((err) => {
      console.error(err);
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

export function setUser(user) {
  user = user;
}

export async function addTask(
  name,
  description,
  helpneeded,
  assigned,
  progress
) {
  if (
    name !== "" &&
    description !== "" &&
    helpneeded !== undefined &&
    assigned !== null &&
    progress !== null
  ) {
    console.log("hello there");
    await db
      .collection("tasks")
      .doc()
      .set({
        description: description,
        helpneeded: helpneeded,
        name: name,
        assigned: assigned,
        progress: progress,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  } else {
    console.error("ERROR");
    throw "Please fill all inputs and try again";
  }
}
