// src/screens/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss"; // Import file CSS để định kiểu cho trang đăng nhập

const Login = ({ setIsLoggedIn, setUserRole }) => { // Nhận setIsLoggedIn và setUserRole như props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://wecareexe201.azurewebsites.net/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: username, // Sử dụng username hoặc email
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Đăng nhập không thành công");
      }

      const data = await response.json();

      // Lấy userRole từ data.result
      const userRole = data.result.userRole; // Cập nhật để lấy từ data.result

      // Lưu token hoặc thông tin người dùng nếu cần thiết
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", userRole); // Lưu userRole

      // Cập nhật trạng thái đăng nhập và vai trò người dùng
      setIsLoggedIn(true);
      setUserRole(userRole);

      if (userRole === 0) {
        navigate("/dashboard"); // Chuyển hướng đến dashboard nếu userRole là 0
      } else {
        alert("Bạn không được phép vào dashboard."); // Hiển thị thông báo nếu userRole khác 0
      }
    } catch (error) {
      alert(error.message); // Hiển thị thông báo lỗi nếu có
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Tên người dùng:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
