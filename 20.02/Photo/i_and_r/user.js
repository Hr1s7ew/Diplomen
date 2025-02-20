import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";


// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyD9BvRWog1WCMeUBFVM8pDH5_jeMQEMBYs",
    authDomain: "diplomen-login.firebaseapp.com",
    projectId: "diplomen-login",
    storageBucket: "diplomen-login.appspot.com",
    messagingSenderId: "191233218898",
    appId: "1:191233218898:web:f112530a881033cdda428b"
};

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

// Инициализиране на Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Трябва да подадем `app` като аргумент

const logout = document.getElementById("logout");

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (user) {
        console.log("✅ Потребителят е логнат:", user.email);

    } else {
        console.log("❌ Няма логнат потребител");
    }
});

logout.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        await signOut(auth);
        showToast("Logout successfully!");

        setTimeout(() => {
            window.location.href = "/index.html"; // Редирект след изход
        }, 2000);
    } catch (error) {
        showToast(`An error occurred when logout: ${error.message}`, true);
    }
});