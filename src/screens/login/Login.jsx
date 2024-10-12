import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss"; // Import file CSS để định kiểu cho trang đăng nhập

const Login = ({ setIsLoggedIn, setUserRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://wecareexe201.azurewebsites.net/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Đăng nhập không thành công");
      }

      const data = await response.json();
      const userRole = data.result.userRole;

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", userRole);

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }

      setIsLoggedIn(true);
      setUserRole(userRole);

      if (userRole === 0) {
        navigate("/dashboard");
      } else {
        alert("Bạn không được phép vào dashboard.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Tài khoản</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="remember-me-container">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe" className="custom-checkbox-label">
                Ghi nhớ tôi
              </label>
            </div>
            <a  
              className="forgot-password-link"
              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan tới checkbox
            >
              Quên mật khẩu?
            </a>
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
        <div className="signup-link">
          <a>Chưa có tài khoản? Đăng ký ngay!</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
