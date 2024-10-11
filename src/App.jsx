// src/App.jsx
import { useContext, useEffect, useState } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, Dietitian, PageNotFound, User, Menu, Login } from "./screens";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userRole, setUserRole] = useState(parseInt(localStorage.getItem("userRole"), 10)); // Lấy userRole từ localStorage

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  useEffect(() => {
    // Cập nhật lại trạng thái nếu có thay đổi trong localStorage
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserRole(parseInt(localStorage.getItem("userRole"), 10));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isLoggedIn && userRole === 0 ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/user" element={isLoggedIn ? <User /> : <Navigate to="/login" />} />
            <Route path="/dietitian" element={isLoggedIn ? <Dietitian /> : <Navigate to="/login" />} />
            <Route path="/menu" element={isLoggedIn ? <Menu /> : <Navigate to="/login" />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>

        <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
          <img className="theme-icon" src={theme === LIGHT_THEME ? SunIcon : MoonIcon} />
        </button>
      </Router>
    </>
  );
}

export default App;
