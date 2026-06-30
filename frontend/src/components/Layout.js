import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/products":
        return "Products";
      case "/categories":
        return "Categories";
      case "/orders":
        return "Orders";
      case "/customers":
        return "Customers";
      case "/payments":
        return "Payments";
      case "/analytics":
        return "Analytics";
      case "/ai-generator":
        return "AI Product Generator";
      default:
        return "AuraCommerce Admin";
    }
  };

  return (
    <div
      className="app-container"
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        display: "flex"
      }}
    >
      <Sidebar collapsed={collapsed} />

      <div
        className="main-content"
        style={{
          flex: 1,
          marginLeft: collapsed ? "70px" : "260px",
          transition: ".3s",
          background: "#F1F5F9"
        }}
      >
        <header
          className="navbar-custom"
          style={{
            height: "70px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px",
            background: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            position: "sticky",
            top: 0,
            zIndex: 100
          }}
        >
          <div className="d-flex align-items-center">
            <button
              className="btn btn-primary rounded-circle me-3"
              style={{
                width: "42px",
                height: "42px"
              }}
              onClick={() => setCollapsed(!collapsed)}
            >
              <i
                className={`bi ${
                  collapsed ? "bi-list" : "bi-layout-sidebar"
                }`}
              ></i>
            </button>

            <div>
              <h4 className="text-white mb-0 fw-bold">
                {getPageTitle()}
              </h4>

              <small className="text-secondary">
                Welcome back, {user?.name}
              </small>
            </div>
          </div>

                    <div className="d-flex align-items-center gap-3">

            {/* Search Box */}

            <div
              className="position-relative d-none d-md-block"
            >

              <i
                className="bi bi-search position-absolute"
                style={{
                  left: "15px",
                  top: "12px",
                  color: "#265ead"
                }}
              ></i>

              <input
                type="text"
                placeholder="Search products..."
                className="form-control"
                style={{
                  width: "260px",
                  paddingLeft: "42px",
                  background: "#8b9ecc",
                  border: "1px solid #89afe3",
                  color: "white",
                  borderRadius: "12px"
                }}
              />

            </div>

            {/* Notification */}

            <button
              className="btn position-relative"
              style={{
                background: "#0f172a",
                color: "white",
                borderRadius: "12px",
                width: "45px",
                height: "45px"
              }}
            >

              <i className="bi bi-bell-fill"></i>

              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                3
              </span>

            </button>

            {/* Profile */}

            <div className="d-flex align-items-center">

              <img
                src={
                  user?.profilePhoto ||
                  "https://i.pravatar.cc/150?img=25"
                }
                alt="Profile"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #2563EB"
                }}
              />

              <div className="ms-3">

                <h6
                  className="text-white mb-0"
                >
                  {user?.name}
                </h6>

                <small
                  className="text-info text-capitalize"
                >
                  {user?.role}
                </small>

              </div>

            </div>

          </div>

        </header>

        <div
          style={{
            padding: "30px"
          }}
        >

          {children}

        </div>

      </div>

    </div>
  )
 
        };    
export default Layout;