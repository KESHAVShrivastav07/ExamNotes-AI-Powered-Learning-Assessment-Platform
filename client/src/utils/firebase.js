
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "examnotesai-e65fc.firebaseapp.com",
  projectId: "examnotesai-e65fc",
  storageBucket: "examnotesai-e65fc.firebasestorage.app",
  messagingSenderId: "571728308977",
  appId: "1:571728308977:web:4b1de903785f54cd279750"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()
// Force Google to show the account chooser so users can select which email to use
provider.setCustomParameters({ prompt: 'select_account' })

export {auth , provider}