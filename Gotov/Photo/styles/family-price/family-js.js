import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyD9BvRWog1WCMeUBFVM8pDH5_jeMQEMBYs",
    authDomain: "diplomen-login.firebaseapp.com",
    projectId: "diplomen-login",
    storageBucket: "diplomen-login.appspot.com",
    messagingSenderId: "191233218898",
    appId: "1:191233218898:web:f112530a881033cdda428b"
};

// Инициализиране на Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Трябва да подадем `app` като аргумент

const discounttag = document.getElementById("discounttag");
const discounttag2 = document.getElementById("discounttag2");

// Функция за проверка дали потребителят е логнат
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ Потребителят е логнат:", user.email);
        discounttag.style.display = "block";
        discounttag2.style.display = "block";
    } else {
        console.log("❌ Няма логнат потребител");
        discounttag.style.display = "none";
        discounttag2.style.display = "none";
    }
});
