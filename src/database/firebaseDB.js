import firebase from "firebase/app";
import * as firebaseAll from "firebase";
import * as admin from "firebase-admin";
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

export async function createNewUser(
  fullName,
  email,
  password,
  phone,
  title,
  imageBlob
) {
  const imageURL = await uploadPicture(imageBlob);
  return await admin
    .auth()
    .createUser({
      email: email,
      password: password,
      photoURL: imageURL,
      displayName: fullName,
      phoneNumber: phone,
      disabled: false,
    })
    .then(async (userRecord) => {
      console.log("Succesfully create employee in firebase!");
      await createEmployee(
        userRecord.email,
        userRecord.uid,
        userRecord.displayName,
        userRecord.photoURL,
        userRecord.phoneNumber,
        title
      );
    })
    .catch((error) => {
      console.log("ERROR", error);
      return error;
    });
}

async function createEmployee(email, id, fullName, imageURL, phone, title) {
  await db
    .collection("employee")
    .doc(id)
    .set({
      email: email,
      imageURL: imageURL,
      name: fullName,
      phone: phone,
      title: title,
    })
    .then(() => {
      console.log("Successfully added employee!");
    })
    .catch((err) => {
      console.error("Something went wrong creating employee record", err);
    });
}

export async function uploadPicture(file) {
  const MyDate = new Date();
  const MyDateString =
    ("0" + MyDate.getDate()).slice(-2) +
    "" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "" +
    MyDate.getFullYear();
  console.log(MyDateString);
  const fileName = MyDateString + "_" + file.name;
  const storageRef = firebaseAll.default.storage().ref();
  const fileRef = storageRef.child(fileName);

  await fileRef.put(file);
  return await fileRef.getDownloadURL();
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

export async function changeHelpRequest(id, bool) {
  return await db
    .collection("tasks")
    .doc(id)
    .update({ helpneeded: bool })
    .then(() => {
      console.log("helpNeeded Fields sucessfully changed");
    })
    .catch((err) => {
      console.error("Error writing document: ", err);
    });
}

export async function getUserTasks() {
  return await db
    .collection("tasks")
    .get()
    .then((ref) => {
      let arr = [];
      ref.docs.forEach((doc) => {
        console.log("returning tasks");

        if (doc.data().assigned === getUser().uid) {
          arr.push({ id: doc.id, data: doc.data() });
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

export async function deleteTask(id) {
  await db.collection("tasks").doc(id).delete();
}
