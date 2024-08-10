import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// var process;
const firebaseConfig = {
  apiKey:"AIzaSyC5Q67T7jkVfybRPNr7uUF-JfC5RtnsfbQ" ,
  // apiKey:import.meta.env.VITEAPP_API ,
  authDomain: "reactchatapp-535dd.firebaseapp.com",
  projectId: "reactchatapp-535dd",
  storageBucket: "reactchatapp-535dd.appspot.com",
  messagingSenderId: "589481689397",
  appId: "1:589481689397:web:abb38494494c43e3154c7c"
};



// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDu9VEj68yvEs5bB_2gXxzvZgh6tzKmxFU",
//   authDomain: "chatapp-7c4d9.firebaseapp.com",
//   projectId: "chatapp-7c4d9",
//   storageBucket: "chatapp-7c4d9.appspot.com",
//   messagingSenderId: "1069141688334",
//   appId: "1:1069141688334:web:0657423d10e76e4b96fc5f"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth =getAuth()
export const db =getFirestore()
export const storage =getStorage(app)

