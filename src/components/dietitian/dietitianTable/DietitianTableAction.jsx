// dietitianTableAction.jsx
import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import { deleteDietitian } from "../../../services/dietitianService"; // Import the delete function

const DietitianTableAction = ({ dietitianId, onDietitianDeleted, name }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleDeleteDietitian = async () => {
    setShowConfirm(true);
  };

  const confirmDeleteDietitian = async () => {
    try {
      const result = await deleteDietitian(dietitianId);
      if (result.isSuccess) {
        onDietitianDeleted(dietitianId);
        alert("Chuyên gia dinh dưỡng đã được xóa thành công!");
      }
    } catch (error) {
      console.error("Error deleting dietitian:", error);
      alert("Có lỗi xảy ra khi xóa chuyên gia dinh dưỡng.");
    }
    setShowConfirm(false);
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
                <button onClick={handleDeleteDietitian} className="dropdown-menu-link">
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
          <p>Bạn có chắc muốn xoá {name}?</p>
          <button onClick={confirmDeleteDietitian} className="confirm-button">Xóa</button>
          <button onClick={() => setShowConfirm(false)} className="cancel-button">Hủy</button>
        </div>
      )}
    </>
  );
};

export default DietitianTableAction;
