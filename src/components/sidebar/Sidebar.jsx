import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import WeCareLogo from "../../assets/images/wecare_logo_size36.png"; // Thêm đường dẫn tới ảnh mới
import { 
  MdPerson, 
  MdLocalHospital, 
  MdRestaurantMenu, 
  MdCategory,
  MdOutlineClose, 
  MdOutlineGridView, 
  MdOutlineSettings, 
  MdOutlineLogout 
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom"; // Thay đổi Link thành NavLink
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate
  
  // State để kiểm tra có hiển thị thông báo xác nhận không
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hàm xử lý hiển thị thông báo xác nhận
  const handleShowLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Xóa thông tin đăng nhập
    localStorage.removeItem("userRole"); // Xóa thông tin vai trò
    navigate("/login"); // Điều hướng về trang đăng nhập
  };

  // Hàm xử lý xác nhận đăng xuất
  const confirmLogout = () => {
    handleLogout();
    setShowLogoutConfirm(false); // Ẩn thông báo xác nhận
  };

  // Hàm xử lý hủy bỏ đăng xuất
  const cancelLogout = () => {
    setShowLogoutConfirm(false); // Ẩn thông báo xác nhận
  };

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={WeCareLogo} alt="WeCare Logo" />
          <span className="sidebar-brand-text">
            <span className="brand-we">We</span>
            <span className="brand-care">care</span>
          </span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to="/dashboard" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Trang chủ</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/user" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdPerson size={20} />
                </span>
                <span className="menu-link-text">Người dùng</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/dietitian" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdLocalHospital size={20} />
                </span>
                <span className="menu-link-text">Chuyên gia dinh dưỡng</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/menu" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdRestaurantMenu size={20} />
                </span>
                <span className="menu-link-text">Menu</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/category" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdCategory size={20} />
                </span>
                <span className="menu-link-text">Danh mục</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <NavLink to="/settings" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Cài đặt</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <button 
                className="menu-link logout-button" // Thêm class mới
                onClick={handleShowLogoutConfirm} // Thay đổi hàm gọi
              >
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Đăng xuất</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Thông báo xác nhận đăng xuất */}
      {showLogoutConfirm && (
        <div className="logout-confirmation">
          <p>Bạn có chắc chắn muốn đăng xuất không?</p>
          <div className="button-container">
            <button onClick={confirmLogout}>Có</button>
            <button onClick={cancelLogout}>Không</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
