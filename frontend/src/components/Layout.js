import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard Statistics";
    if (path === "/products") return "Products Inventory";
    if (path === "/categories") return "Categories Management";
    if (path === "/orders") return "Orders Management";
    if (path === "/customers") return "Customers Directory";
    if (path === "/ai-generator") return "AI Description Generator";
    return "Admin Panel";
  };

  return (
    <div className="app-container">
      {/* Admin Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Admin Main Content Wrapper */}
      <div className="main-content d-flex flex-column flex-grow-1">
        {/* Admin Header Navbar */}
        <header className="navbar-custom">
          <div className="d-flex align-items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="btn btn-outline-primary border-0 rounded-circle p-2 me-3 icon-button-luxury"
              aria-label="Toggle Sidebar"
            >
              <i className={`bi ${collapsed ? "bi-list" : "bi-arrow-left-short"} fs-5`}></i>
            </button>
            <div>
              <p className="mb-1 section-kicker">E-Commerce Admin</p>
              <h4 className="m-0 fw-semibold">{getPageTitle()}</h4>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Global Search */}
            <div className="d-none d-md-flex align-items-center position-relative me-3">
              <i className="bi-search text-muted position-absolute start-3 ms-3"></i>
              <input
                type="text"
                placeholder="Search console..."
                className="form-control form-control-custom ps-5"
                style={{ width: "220px" }}
              />
            </div>

            {/* Notifications */}
            <button className="btn btn-outline-primary border-0 rounded-circle position-relative p-2 icon-button-luxury">
              <i className="bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark border-2 p-1" style={{ fontSize: "0.5rem" }}>
                2
              </span>
            </button>

            {/* User Profile */}
            <div className="d-flex align-items-center gap-2 border-start ps-3 ms-1" style={{ borderColor: "var(--color-border)" }}>
              <div className="d-flex flex-column text-end d-none d-sm-block">
                <span className="fw-bold small m-0">{user?.name || "Admin"}</span>
                <span className="text-muted extra-small text-capitalize" style={{ fontSize: "0.75rem" }}>{user?.role || "Staff"}</span>
              </div>
              <div 
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "40px", height: "40px", fontSize: "1rem", background: "var(--color-accent)" }}
              >
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="container-fluid p-0 fade-in flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
