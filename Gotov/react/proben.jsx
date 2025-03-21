// App.js
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import ConditionsPage from "./components/ConditionsPage";
import ContactPage from "./components/ContactPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/general.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/conditions" element={<ConditionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

// components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="left-section">
        <div className="dropdown">
          <button className="dropbtn">&#x25BC; Портфолио</button>
          <div className="dropdown-content">
            <Link to="/portfolio/family">Семейни фотосесии</Link>
            <Link to="/portfolio/children">Детска радост</Link>
            <Link to="/portfolio/limited">Лимитирани</Link>
          </div>
        </div>

        <div className="dropdown2">
          <button className="dropbtn2">&#x25BC; Цени/Сесии</button>
          <div className="dropdown-content2">
            <Link to="/prices/family">Семейни</Link>
            <Link to="/prices/children">Детска радост</Link>
            <Link to="/prices/spring2024">Пролет 2024</Link>
          </div>
        </div>

        <Link className="condition-decoration" to="/conditions">Условия</Link>
      </div>
      <div className="middle-section">
        <Link className="logo-decoration" to="/">
          Dream Crafted
        </Link>
      </div>
      <div className="right-section">
        <Link className="contact-decoration" to="/contact">Контакти</Link>
        <p className="about-us">За нас</p>
        <div className="icons">
          <ion-icon class="logo-instagram" name="logo-instagram"></ion-icon>
          <ion-icon class="logo-tiktok" name="logo-tiktok"></ion-icon>
          <Link to="/register">
            <ion-icon class="logo-register" name="person-circle-outline"></ion-icon>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

// components/Footer.jsx
import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inside">
        <div className="footer-left">
          <h2 className="footer-left-title">Кои сме ние</h2>
          <hr style={{ marginTop: "5px", width: "22vw" }} />
          <h3 className="footer-section1-text">
            Ние сме екип от страстни професионалисти, обединени от любовта към фотографията и визуалното
            изкуство...
          </h3>
        </div>
        <div className="footer-center">
          <h2 className="footer-center-title">Научавай първи</h2>
          <hr style={{ marginTop: "5px", width: "34vw" }} />
          <input type="text" className="footer-input" placeholder="E-mail" />
        </div>
        <div className="footer-right">
          <h2 className="footer-right-title">Последвай ме</h2>
          <hr style={{ marginTop: "5px", width: "26vw" }} />
          <div className="footer-icons">
            <ion-icon class="logo-instagram-footer" name="logo-instagram"></ion-icon>
            <ion-icon class="logo-tiktok-footer" name="logo-tiktok"></ion-icon>
          </div>
        </div>
      </div>
      <hr style={{ marginTop: "75px", width: "95vw" }} />
      <div className="footer-bottom">
        <div className="footer-bottom-icons">
          <ion-icon class="logo-instagram-footer-bottom" name="logo-instagram"></ion-icon>
          <ion-icon class="logo-tiktok-footer-bottom" name="logo-tiktok"></ion-icon>
        </div>
        <div className="footer-bottom-text">
          <a className="policy" href="">Политика за поверителност</a>
          <a className="general-terms" href="">ОБЩИ УСЛОВИЯ</a>
          <p>Dimitar Hristev | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// components/HomePage.jsx
import React from "react";
import "../styles/basis.css";

const HomePage = () => {
  return (
    <div className="basis">
      <p className="title">Начало</p>
      <div className="myself">
        <img className="main-photo" src="images/main-photo.jpeg" alt="Main" />
        <p>Здравейте, аз съм Димитър Христев...</p>
      </div>
    </div>
  );
};

export default HomePage;

// components/ConditionsPage.jsx
import React from "react";
import "../styles/conditions.css";

const ConditionsPage = () => {
  return (
    <div className="basis">
      <p className="title">Условия</p>
      <p className="text1-conditions">Във връзка с новия регламент...</p>
    </div>
  );
};

export default ConditionsPage;

// components/ContactPage.jsx
import React from "react";
import "../styles/contact.css";

const ContactPage = () => {
  return (
    <div className="form-container">
      <form>
        <label htmlFor="name">Име (задължително)</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Вашият E-mail (задължително)</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="phone">Телефонен номер (задължително)</label>
        <input type="tel" id="phone" name="phone" required />

        <label htmlFor="message">Направете Вашето запитване тук:</label>
        <textarea id="message" name="message" rows="4"></textarea>

        <button type="submit">ИЗПРАТИ ЗАПИТВАНЕ</button>
      </form>
    </div>
  );
};

export default ContactPage;
console.log("ConditionsPage component loaded");
console.log("ContactPage component loaded");console.log("ConditionsPage component loaded");
console.log("ContactPage component loaded");