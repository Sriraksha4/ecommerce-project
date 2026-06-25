import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav 
      className={`navbar navbar-expand-lg ${theme === "light" ? "navbar-light" : "navbar-dark"} sticky-top`} 
      style={{ 
        background: theme === "light" ? "rgba(255, 255, 255, 0.92)" : "rgba(15, 23, 42, 0.95)", 
        borderBottom: theme === "light" ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid rgba(255, 255, 255, 0.08)", 
        backdropFilter: "blur(12px)" 
      }}
    >
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi-bag-heart-fill text-primary me-2 fs-4"></i>
          <span className={theme === "light" ? "text-dark fw-extrabold" : "text-white fw-extrabold"} style={{ letterSpacing: "0.5px" }}>AuraCommerce</span>
        </Link>
        {/* Toggler */}
        <button
          className="navbar-toggler border-0 p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#storefrontNavbar"
          aria-controls="storefrontNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Links */}
        <div className="collapse navbar-collapse" id="storefrontNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-semibold px-3" to="/shop">Shop</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`btn ${theme === "light" ? "btn-light" : "btn-dark"} border-0 rounded-circle p-2 d-flex align-items-center justify-content-center`}
              style={{ width: "42px", height: "42px" }}
              title="Toggle Theme"
            >
              {theme === "light" ? (
                <i className="bi-moon-fill text-warning fs-5"></i>
              ) : (
                <i className="bi-sun-fill text-warning fs-5"></i>
              )}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`btn ${theme === "light" ? "btn-light" : "btn-dark"} border-0 rounded-circle p-2 position-relative d-flex align-items-center justify-content-center`}
              style={{ width: "42px", height: "42px" }}
              title="My Wishlist"
            >
              <i className="bi-heart text-danger fs-5"></i>
              {user?.wishlist?.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 px-2" style={{ fontSize: "0.7rem", borderColor: theme === "light" ? "#fff" : "#000" }}>
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className={`btn ${theme === "light" ? "btn-light" : "btn-dark"} border-0 rounded-circle position-relative p-2 d-flex align-items-center justify-content-center`}
              style={{ width: "42px", height: "42px" }}
              title="View Cart"
            >
              <i className={`bi-cart2 ${theme === "light" ? "text-dark" : "text-light"} fs-5`}></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-2 px-2" style={{ fontSize: "0.7rem", borderColor: theme === "light" ? "#fff" : "#000" }}>
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Profile Dropdown */}
            {user ? (
              <div className="dropdown">
                <button
                  className={`btn ${theme === "light" ? "btn-light" : "btn-dark"} border-0 rounded-pill px-3 py-2 d-flex align-items-center gap-2`}
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div 
                    className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "30px", height: "30px", fontSize: "0.85rem" }}
                  >
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className={`${theme === "light" ? "text-dark" : "text-white"} small fw-bold d-none d-sm-inline`}>
                    {user.name ? user.name.split(" ")[0] : "User"}
                  </span>
                  <i className="bi-chevron-down text-muted small"></i>
                </button>
                <ul 
                  className={`dropdown-menu dropdown-menu-end ${theme === "light" ? "" : "dropdown-menu-dark"} border border-secondary border-opacity-25 mt-2`} 
                  aria-labelledby="profileDropdown" 
                  style={{ borderRadius: "12px", background: theme === "light" ? "#ffffff" : "#0f172a" }}
                >
                  <li>
                    <Link className="dropdown-item py-2 small d-flex align-items-center" to="/profile">
                      <i className="bi-person me-2 text-muted"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item py-2 small d-flex align-items-center" to="/my-orders">
                      <i className="bi-receipt me-2 text-muted"></i> My Orders
                    </Link>
                  </li>
                  {user.role === "admin" && (
                    <>
                      <li><hr className="dropdown-divider border-secondary border-opacity-20" /></li>
                      <li>
                        <Link className="dropdown-item py-2 small text-primary fw-bold d-flex align-items-center" to="/dashboard">
                          <i className="bi-shield-check me-2"></i> Admin Panel
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider border-secondary border-opacity-20" /></li>
                  <li>
                    <button className="dropdown-item py-2 small text-danger d-flex align-items-center border-0 bg-transparent w-100 text-start" onClick={handleLogout}>
                      <i className="bi-box-arrow-left me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className={`btn ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"} border-secondary border-opacity-25 rounded-pill px-4 btn-sm fw-semibold`}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-gradient rounded-pill px-4 btn-sm fw-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
