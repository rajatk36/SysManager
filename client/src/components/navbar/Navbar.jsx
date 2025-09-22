import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaBars, FaUser, FaSignOutAlt, FaHome, FaUsers, FaFileInvoice, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    // Add event listener when dropdowns are open
    if (showMenuDropdown || showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenuDropdown, showProfileDropdown]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaHome /> },
    { path: "/customer", label: "Customers", icon: <FaUsers /> },
    { path: "/bill", label: "Bills", icon: <FaFileInvoice /> },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        {/* Menu Dropdown Button */}
        <div className="menu-dropdown" ref={menuRef}>
          <button 
            className="btn btn-outline-light" 
            onClick={() => setShowMenuDropdown(!showMenuDropdown)}
          >
            <FaBars />
          </button>
          
          {/* Menu Dropdown Overlay */}
          {showMenuDropdown && (
            <div 
              className="menu-dropdown-overlay"
              onClick={() => setShowMenuDropdown(false)}
            >
              <div 
                className="menu-dropdown-content"
                onClick={(e) => e.stopPropagation()}
              >
                {menuItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.path} 
                    className="menu-dropdown-item"
                    onClick={() => setShowMenuDropdown(false)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="profile-dropdown" ref={profileRef}>
          <button 
            className="btn btn-outline-light profile-btn"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <FaUserCircle size={24} />
          </button>
          
          {showProfileDropdown && (
            <div className="profile-dropdown-content">
              <Link 
                to="/profile" 
                className="profile-dropdown-item"
                onClick={() => setShowProfileDropdown(false)}
              >
                <FaUser className="me-2" />
                Profile
              </Link>
              <button 
                className="profile-dropdown-item logout-btn"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
