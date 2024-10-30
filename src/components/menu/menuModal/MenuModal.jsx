import React, { useState, useEffect } from "react";
import { createMenu } from "../../../services/menuService";
import { fetchAllDietitians } from "../../../services/dietitianService"; // Import hàm fetch
import "./MenuModal.scss";

const MenuModal = ({ onClose, onMenuCreated }) => {
  const [menuData, setMenuData] = useState({
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    dietitianId: "",
    menuName: "",
    description: "",
    suitableFor: 0,
    imageUrl: "",
    status: 1,
    isActive: true,
    totalCalories: 0,
    totalCarbohydrates: 0,
    totalProtein: 0,
    totalFat: 0,
    totalFiber: 0,
    totalSugar: 0,
    totalPurine: 0,
    totalCholesterol: 0,
    createdBy: "Admin",
    createdDate: new Date().toISOString(),
    lastUpdatedBy: "Admin",
    lastUpdatedDate: new Date().toISOString(),
    isDeleted: false,
  });

  const [dietitians, setDietitians] = useState([]); // State để lưu danh sách dietitian

  useEffect(() => {
    const fetchDietitians = async () => {
      try {
        const data = await fetchAllDietitians(); // Lấy danh sách dietitian
        setDietitians(data.results); // Lưu vào state
      } catch (error) {
        console.error("Error fetching dietitians:", error);
      }
    };

    fetchDietitians();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuData({ ...menuData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMenu(menuData);
      onMenuCreated();
      onClose();
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Tạo mới Menu</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="menuName" placeholder="Tên menu" onChange={handleChange} required />
          <input type="text" name="description" placeholder="Mô tả" onChange={handleChange} required />
          
          {/* Thay đổi ở đây: dropdown cho dietitian */}
          <select name="dietitianId" onChange={handleChange} required>
            <option value="">Chọn chuyên gia dinh dưỡng</option>
            {dietitians.map((dietitian) => (
              <option key={dietitian.id} value={dietitian.id}>
                {dietitian.name}
              </option>
            ))}
          </select>
          
          <select name="suitableFor" onChange={handleChange} required>
            <option value="0">Phù Hợp Tiểu đường</option>
            <option value="1">Phù Hợp Gout</option>
            <option value="2">Phù Hợp Cả 2</option>
          </select>
          <input type="number" name="totalCalories" placeholder="Tổng calo" onChange={handleChange} />
          <input type="number" name="totalCarbohydrates" placeholder="Tổng Carbohydrates" onChange={handleChange} />
          <input type="number" name="totalProtein" placeholder="Tổng Protein" onChange={handleChange} />
          <input type="number" name="totalFat" placeholder="Tổng chất béo" onChange={handleChange} />
          <input type="number" name="totalFiber" placeholder="Tổng chất xơ" onChange={handleChange} />
          <input type="number" name="totalSugar" placeholder="Tổng lượng đường" onChange={handleChange} />
          <input type="number" name="totalPurine" placeholder="Tổng Purine" onChange={handleChange} />
          <input type="number" name="totalCholesterol" placeholder="Tổng Cholesterol" onChange={handleChange} />
          <button type="submit">Tạo Menu</button>
          <button type="button" className="cancel-button" onClick={onClose}>Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
