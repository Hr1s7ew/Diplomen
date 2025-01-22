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
// Firebase Initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Toast Notification Function
function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
    toastMessage.textContent = message;
    toast.style.backgroundColor = isError ? "#ff4d4d" : "#4CAF50"; // Червено за грешки, зелено за успех
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000); // 3 секунди показване
}

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

        showToast("Account successfully created!");
        setTimeout(() => {
            window.location.href = "/index.html"; // Редирект след успех
        }, 2000);
    } catch (error) {
        const errorCode = error.code;

        if (errorCode === 'auth/email-already-in-use') {
            showToast("Email address already exists!", true);
        } else {
            showToast(`Error: ${error.message}`, true);
        }
    }
});