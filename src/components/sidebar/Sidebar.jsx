import { useContext, useEffect, useRef } from "react";
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
import { NavLink } from "react-router-dom"; // Thay đổi Link thành NavLink
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
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
              <NavLink to="/" className="menu-link" activeClassName="active">
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
              <NavLink to="/" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                <span className="menu-link-text">Settings</span>
              </NavLink>
            </li>
            <li className="menu-item">
              <NavLink to="/" className="menu-link" activeClassName="active">
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
