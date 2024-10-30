import React, { useState, useEffect } from "react";
import { createDietitian } from "../../../services/dietitianService"; // Import dietitian service
import "./DietitianModal.scss";

const DietitianModal = ({ onClose, onDietitianCreated }) => {
  const [newDietitian, setNewDietitian] = useState({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Example UUID
    name: "",
    email: "",
    phone: "",
    specialization: "",
    createdBy: "Admin",
    createdDate: new Date().toISOString(),
    lastUpdatedBy: "Admin",
    lastUpdatedDate: new Date().toISOString(),
    isDeleted: false,
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDietitian((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createDietitian(newDietitian);
      console.log("Dietitian created:", response);
      onDietitianCreated(newDietitian); // Call the function to update the table
      setSuccessMessage("Chuyên gia dinh dưỡng đã được tạo thành công!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose(); // Close modal
      }, 2000);
    } catch (error) {
      console.error("Failed to create dietitian:", error);
    }
  };

  // Handle keydown event
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose(); // Close modal when Escape is pressed
    }
  };


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Tạo mới chuyên gia dinh dưỡng</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={newDietitian.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newDietitian.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={newDietitian.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Chuyên môn"
            value={newDietitian.specialization}
            onChange={handleChange}
            required
          />
          <button type="submit">Tạo mới</button>
          <button type="button" className="cancel-button" onClick={onClose}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default DietitianModal;
