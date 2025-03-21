import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
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

        showToast("Успешно създадохте профил!");
        setTimeout(() => {
            window.location.href = "/family-price.html"; // Редирект след успех
        }, 2000);
    } catch (error) {
        const errorCode = error.code;

        if (errorCode === 'auth/email-already-in-use') {
            showToast("Този имейл адрес вече съществува!", true);
        } else {
            showToast(`Грешка: ${error.message}`, true);
        }
    }
});

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Проследяване на логването
onAuthStateChanged(auth, (user) => {
    const loadingDiv = document.getElementById('loading');
    const contentDiv = document.getElementById('content');

    if (user) {
        console.log("✅ Потребителят е логнат:", user.email);
        window.location.replace('/i_and_r/user.html');
    } else {
        console.log("❌ Няма логнат потребител");
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';
    }
});