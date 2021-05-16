import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import axios from "axios";

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
    .then(async (res) => {
      let found = false;
      (await getEmployees()).forEach((val) => {
        if (val.id === res.user.uid) {
          found = true;
        }
      });
      if (!found) {
        console.log("Does not contain user, creating new!");
        await createEmployee(
          res.user.email,
          res.user.uid,
          res.user.displayName,
          res.user.photoURL,
          res.user.phoneNumber,
          res.user.displayName
        );
      } else {
        console.log("Already contains user, will only log in.");
      }

      return "success";
    })
    .catch((error) => {
      return [{ result: "error", message: error.message, code: error.code }];
    });

  return res;
}

export async function createSeverityTasks() {
  await db
    .collection("tasks")
    .get()
    .then((res) => {
      for (const task of res.docs) {
        if (task.get("severity") === undefined) {
          const number = Math.floor(Math.random() * 11);
          db.collection("tasks")
            .doc(task.id)
            .update({
              severity: number,
            })
            .then(() => {
              console.log("Successfully Created Severity Field");
            })
            .catch((err) => {
              console.error("could not create severity field");
              throw err;
            });
        } else {
          console.log("Severity Field already exists");
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function normalLogin(email, password) {
  console.log(typeof password);
  return await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      // ...
      console.log("SUCCESSFULLY LOGGED IN");
    })
    .catch((error) => {
      throw error;
    });
}

export async function createNewUser(
  name,
  email,
  phone,
  password,
  title,
  imageURL
) {
  const trimmedPassword = password.trim();
  return await axios
    .post("https://thesis-node-api.vercel.app/api/createUser", {
      name: name,
      email: email,
      phone: phone,
      password: trimmedPassword,
      title: title,
      imageURL: imageURL,
    })
    .then(async (res) => {
      await createEmployee(email, res.data.uid, name, imageURL, phone, title);
      return "User succesfully created!";
    })
    .catch((err) => {
      if (err.response) {
        console.error(err.response.data.message);
        throw err.response.data.message;
      }
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

export async function uploadPicture(file, size, type) {
  let fileType;
  const MyDate = new Date();
  const MyDateString =
    ("0" + MyDate.getDate()).slice(-2) +
    "" +
    ("0" + (MyDate.getMonth() + 1)).slice(-2) +
    "" +
    MyDate.getFullYear();
  console.log(MyDateString);
  if (type.includes("jpeg")) {
    fileType = ".jpg";
  } else {
    fileType = ".png";
  }
  const fileName = MyDateString + "_" + size + fileType;
  const storageRef = firebase.storage().ref();
  const fileRef = storageRef.child("profilePictures/" + fileName);

  await fileRef.put(file);
  return fileRef;
}

export async function getEmployees() {
  return await db
    .collection("employee")
    .get()
    .then(async (ref) => {
      let arr = [];
      for (const doc of ref.docs) {
        if (doc.id !== getUser().uid) {
          arr.push({ id: doc.id, data: doc.data() });
        }
      }
      return arr;
    });
}

export async function createTaskHelp(id, severity, description) {
  return await db
    .collection("tasks")
    .doc(id)
    .update({ severity: severity, helpDescription: description })
    .then(() => {
      console.log("Task Help succesfully created!");
      return true;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

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

export async function getMyTasks() {
  return await db
    .collection("tasks")
    .get()
    .then((ref) => {
      let arr = [];
      ref.docs.forEach((doc) => {
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

export async function getUserTasks(id) {
  return await db
    .collection("tasks")
    .get()
    .then((ref) => {
      let arr = [];
      ref.docs.forEach((doc) => {
        if (doc.data().assigned === id) {
          console.log(id);
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

export async function addTask(
  name,
  description,
  helpneeded,
  assigned,
  severity,
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
        severity: severity,
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
    throw new Error("Please fill all inputs and try again");
  }
}

export async function deleteTask(id) {
  await db.collection("tasks").doc(id).delete();
}
