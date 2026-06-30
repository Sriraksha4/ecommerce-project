import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/products", label: "Products", icon: "bi-box-seam" },
    { path: "/categories", label: "Categories", icon: "bi-tags" },
    { path: "/orders", label: "Orders", icon: "bi-cart3" },
    { path: "/customers", label: "Customers", icon: "bi-people-fill" },
    { path: "/payments", label: "Payments", icon: "bi-credit-card" },
    { path: "/analytics", label: "Analytics", icon: "bi-bar-chart-line" },
    { path: "/ai-generator", label: "AI Assistant", icon: "bi-robot" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
  className={`sidebar ${collapsed ? "collapsed" : ""}`}
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }}
>

      <div className="sidebar-brand">
        <i className="bi bi-bag-check-fill text-primary fs-3 me-2"></i>
        {!collapsed && (
          <div>
            <h5 className="m-0 text-white fw-bold">AuraCommerce</h5>
            <small className="text-secondary">
              Admin Console
            </small>
          </div>
        )}
      </div>

      <ul className="sidebar-menu">

        {menuItems.map((item) => (
          <li key={item.path} className="sidebar-item">

            <Link
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <i className={`bi ${item.icon}`}></i>

              {!collapsed && (
                <span className="sidebar-text">
                  {item.label}
                </span>
              )}

            </Link>

          </li>
        ))}

      </ul>

      <div className="mt-auto p-3 border-top border-secondary">

        {!collapsed && (

          <div className="text-center mb-3">

            <img
              src={
                user?.profilePhoto ||
                "https://i.pravatar.cc/150?img=25"
              }
              alt="Admin"
              className="rounded-circle mb-2"
              width="70"
              height="70"
            />

            <h6 className="text-white mb-0">
              {user?.name}
            </h6>

            <small className="text-info">
              Administrator
            </small>

          </div>

        )}

        <button
          className="btn btn-danger w-100 rounded-pill"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>

          {!collapsed && "Logout"}

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;