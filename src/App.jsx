import { useContext, useEffect, useState } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, Dietitian, PageNotFound, User, Menu, Login } from "./screens";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS của Toastify

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userRole, setUserRole] = useState(parseInt(localStorage.getItem("userRole"), 10));

  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setUserRole(parseInt(localStorage.getItem("userRole"), 10));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // Đặt thời gian đăng xuất tự động sau 1 phút (60 giây)
      const timer = setTimeout(() => {
        setIsLoggedIn(false);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
        toast.warn("Vui lòng đăng nhập lại để tiếp tục."); // Hiển thị thông báo
      }, 600000); 

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

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

      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </>
  );
}

export default App;
