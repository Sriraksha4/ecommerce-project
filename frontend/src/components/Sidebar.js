import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { path: "/products", label: "Products", icon: "bi-box-seam" },
    { path: "/categories", label: "Categories", icon: "bi-tags" },
    { path: "/orders", label: "Orders", icon: "bi-cart-check" },
    { path: "/customers", label: "Customers", icon: "bi-people" },
    { path: "/ai-generator", label: "AI Generator", icon: "bi-cpu" },
  ];
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand logo */}
      <div className="sidebar-brand">
        <i className="bi-shield-check text-primary me-2"></i>
        <span className="sidebar-brand-text fw-bold text-white">Aura Console</span>
      </div>
      {/* Menu links */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="sidebar-item">
            <Link
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="sidebar-text">{item.label}</span>
            </Link>
          </li>
        ))}
        {/* Back to store */}
        <li className="sidebar-item border-top border-secondary border-opacity-10 mt-3 pt-3">
          <Link to="/" className="sidebar-link text-info">
            <i className="bi-shop"></i>
            <span className="sidebar-text text-info fw-bold">Back To Store</span>
          </Link>
        </li>
      </ul>
      {/* Admin Name & Logout */}
      <div className="p-3 border-top border-secondary border-opacity-25 mt-auto">
        {!collapsed && (
          <div className="d-flex align-items-center gap-2 mb-3 px-2">
            <div 
              className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}
            >
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="d-flex flex-column" style={{ maxWidth: "150px" }}>
              <span className="text-white small fw-bold text-truncate">{user?.name || "Admin"}</span>
              <span className="text-muted extra-small text-capitalize" style={{ fontSize: "0.7rem" }}>{user?.role || "Staff"}</span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center border-0 py-2 rounded-3"
          title="Sign Out"
        >
          <i className="bi-box-arrow-left me-2"></i>
          {!collapsed && <span className="fw-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
