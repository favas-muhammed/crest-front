import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

// Import icons
import homeIcon from "../../assets/home.png";
import bellIcon from "../../assets/bell.png";
import searchIcon from "../../assets/search.png";
import userIcon from "../../assets/user.png";
import powerOffIcon from "../../assets/power-off.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
    window.location.reload(); // Reload to reset the app state
  };

  const navigationItems = [
    { icon: homeIcon, path: "/", label: "Home" },
    { icon: bellIcon, path: "/notifications", label: "Notifications" },
    { icon: searchIcon, path: "/search", label: "Search" },
    { icon: userIcon, path: "/profile", label: "Profile" },
  ];

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {navigationItems.map((item, index) => (
          <div
            key={index}
            className="nav-item"
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            <img src={item.icon} alt={item.label} className="nav-icon" />
          </div>
        ))}
        <div className="nav-item logout" onClick={handleLogout} title="Logout">
          <img src={powerOffIcon} alt="Logout" className="nav-icon" />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
