import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);

// Login Event Listener
function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = isError ? "error" : "success";
    toast.style.backgroundColor = isError ? "#ff4d4d" : "#4CAF50";
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// Login Event Listener
document.getElementById('submitSignIn').addEventListener("click", async (event) => {
    event.preventDefault(); // Prevents form submission

    // Get email and password from input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showToast("Login successful!");
        setTimeout(() => {
            window.location.href = "/index.html"; // Редирект след успех
        }, 2000);
    } catch (error) {
        // Handle different login errors
        if (error.code === 'auth/wrong-password') {
            showToast('Incorrect password!', true);
        } else if (error.code === 'auth/user-not-found') {
            showToast('No user found with this email!', true);
        } else {
            showToast(`Incorrect data!`, true);
        }
    }
});