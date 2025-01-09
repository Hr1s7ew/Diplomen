import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9BvRWog1WCMeUBFVM8pDH5_jeMQEMBYs",
    authDomain: "diplomen-login.firebaseapp.com",
    projectId: "diplomen-login",
    storageBucket: "diplomen-login.appspot.com",
    messagingSenderId: "191233218898",
    appId: "1:191233218898:web:f112530a881033cdda428b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Sign-up Event Listener
const signUpButton = document.getElementById('submitSignUp');
signUpButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userData = { username, email };

        // Save user data in Firestore
        await setDoc(doc(db, 'users', user.uid), userData);

        alert("Account successfully created!");
        window.location.href = "/index.html";
    } catch (error) {
        const errorCode = error.code;

        if (errorCode === 'auth/email-already-in-use') {
            alert('Email address already exists!');
        } else {
            alert(`Error: ${error.message}`);
        }
    }
});
