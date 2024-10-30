import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import { deleteMenu } from "../../../services/menuService"; // Nhập hàm deleteMenu

const MenuTableAction = ({ menuId, onMenuDeleted, menuName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Trạng thái xác nhận xóa

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteMenu = () => {
    setShowConfirm(true); // Hiển thị hộp thoại xác nhận
  };

  const confirmDeleteMenu = async () => {
    try {
      await deleteMenu(menuId); // Gọi hàm xóa menu
      onMenuDeleted(); // Cập nhật danh sách menu
      alert("Menu đã được xóa thành công!"); // Thông báo thành công
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("Có lỗi xảy ra khi xóa menu.");
    }
    setShowConfirm(false); // Đóng hộp thoại xác nhận
  };

  return (
    <>
      <button
        type="button"
        className="action-dropdown-btn"
        onClick={handleDropdown}
      >
        <HiDotsHorizontal size={18} />
        {showDropdown && (
          <div className="action-dropdown-menu" ref={dropdownRef}>
            <ul className="dropdown-menu-list">
              <li className="dropdown-menu-item">
                <Link to="/view" className="dropdown-menu-link">
                  Edit
                </Link>
              </li>
              <li className="dropdown-menu-item">
                <button onClick={handleDeleteMenu} className="dropdown-menu-link">
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </button>

      {/* Hộp thoại xác nhận xóa */}
      {showConfirm && (
        <div className="confirm-dialog">
          <p>Bạn có chắc muốn xoá menu {menuName}?</p>
          <button onClick={confirmDeleteMenu} className="confirm-button">Xóa</button>
          <button onClick={() => setShowConfirm(false)} className="cancel-button">Hủy</button>
        </div>
      )}
    </>
  );
};

export default MenuTableAction;
