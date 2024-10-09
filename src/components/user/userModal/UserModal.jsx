import React, { useState } from "react";
import { createUser } from "../../../services/userService"; // Gọi API tạo người dùng
import "./UserModal.scss";

const UserModal = ({ onClose, onUserCreated }) => {
    const [newUser, setNewUser] = useState({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        username: "",
        password: "defaultPassword", // Giả định một mật khẩu mặc định
        fullName: "",
        imageUrl: "",
        email: "",
        dob: "",
        address: "",
        gender: 0,
        phone: "",
        userType: 0,
        diseaseType: 0,
        userRole: 0,
        createdBy: "Admin", // Giá trị mặc định
        createdDate: new Date().toISOString(),
        lastUpdatedBy: "Admin",
        lastUpdatedDate: new Date().toISOString(),
        isDeleted: false, // Giả định giá trị mặc định
    });

    const [successMessage, setSuccessMessage] = useState(""); // State cho thông báo thành công

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [name]: name === "gender" || name === "userType" || name === "diseaseType" || name === "userRole" ? parseInt(value) : value, // Chuyển đổi cho các enum
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createUser(newUser);
            console.log("User created:", response);
            onUserCreated(newUser); // Gọi hàm để cập nhật bảng người dùng
            setSuccessMessage("Người dùng đã được tạo thành công!"); // Cập nhật thông báo thành công
            setTimeout(() => {
                setSuccessMessage(""); // Xóa thông báo sau 3 giây
                onClose(); // Đóng modal
            }, 2000);
        } catch (error) {
            console.error("Failed to create user:", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Tạo mới người dùng</h2>
                {successMessage && <div className="success-message">{successMessage}</div>} {/* Hiển thị thông báo thành công */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Tài khoản"
                        value={newUser.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Họ tên"
                        value={newUser.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        value={newUser.dob}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Địa chỉ"
                        value={newUser.address}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={newUser.phone}
                        onChange={handleChange}
                        required
                    />
                    <select name="gender" value={newUser.gender} onChange={handleChange} required>
                        <option value={0}>Nam</option>
                        <option value={1}>Nữ</option>
                        <option value={2}>Khác</option>
                    </select>
                    <select name="userType" value={newUser.userType} onChange={handleChange} required>
                        <option value={0}>Free</option>
                        <option value={1}>Premium</option>
                    </select>
                    <select name="diseaseType" value={newUser.diseaseType} onChange={handleChange} required>
                        <option value={0}>Tiểu đường</option>
                        <option value={1}>Gout</option>
                        <option value={2}>Cả hai</option>
                    </select>
                    <select name="userRole" value={newUser.userRole} onChange={handleChange} required>
                        <option value={0}>Admin</option>
                        <option value={1}>Staff</option>
                        <option value={2}>User</option>
                    </select>
                    <button type="submit">Tạo người dùng</button>
                </form>
                <button className="close-modal" onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
};

export default UserModal;
