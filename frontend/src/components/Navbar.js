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
      className={`navbar navbar-expand-lg sticky-top navbar-luxury ${
        theme === "light" ? "navbar-light" : "navbar-dark"
      }`}
    >
      <div className="container">

        {/* Logo */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="/"
        >
          <i className="bi bi-bag-heart-fill text-primary fs-4"></i>
          <span
            className="fw-bold"
            style={{
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            E-Commerce
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#storefrontNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="storefrontNavbar"
        >
          {/* Navigation */}
          <ul className="navbar-nav me-auto ms-lg-4">
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 nav-link-luxury"
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 nav-link-luxury"
                to="/shop"
              >
                Shop
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
            >
              {theme === "light" ? (
                <i className="bi bi-moon-fill text-warning fs-5"></i>
              ) : (
                <i className="bi bi-sun-fill text-warning fs-5"></i>
              )}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="btn btn-outline-primary rounded-circle position-relative p-2"
            >
              <i className="bi bi-heart text-danger fs-5"></i>

              {user?.wishlist?.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="btn btn-outline-primary rounded-circle position-relative p-2"
            >
              <i
                className={`bi bi-cart2 ${
                  theme === "light"
                    ? "text-dark"
                    : "text-light"
                } fs-5`}
              ></i>

              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="dropdown">

                <button
                  className="btn btn-outline-primary border-0 rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                >
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: 34,
                      height: 34,
                      background: "var(--color-accent)"
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="fw-semibold d-none d-sm-inline">
                    {user.name?.split(" ")[0]}
                  </span>

                  <i className="bi bi-chevron-down"></i>
                </button>

                {/* NEW ACCOUNT MENU */}

                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg rounded-4 mt-2 p-2 bg-dark border border-secondary"
                  style={{ minWidth: "230px" }}
                >

                  <li>
                    <div className="px-3 py-2">
                      <strong className="text-white">{user.name}</strong>

                      <br />

                      <small className="text-light">
                        {user.email}
                      </small>
                    </div>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item rounded-3 py-2 text-white"
                      to="/profile"
                    >
                      <i className="bi bi-person-circle me-2"></i>

                      My Profile
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item rounded-3 py-2 text-white"
                      to="/my-orders"
                    >
                      <i className="bi bi-box-seam me-2"></i>

                      My Orders
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item rounded-3 py-2 text-white"
                      to="/wishlist"
                    >
                      <i className="bi bi-heart me-2 text-danger"></i>

                      Wishlist
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item rounded-3 py-2 text-white"
                      to="/cart"
                    >
                      <i className="bi bi-cart3 me-2"></i>

                      My Cart
                    </Link>
                  </li>

                  {user.role === "admin" && (
                    <>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <Link
                          className="dropdown-item rounded-3 py-2 fw-bold text-primary"
                          to="/dashboard"
                        >
                          <i className="bi bi-speedometer2 me-2"></i>

                          Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item rounded-3 py-2 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>

                      Logout
                    </button>
                  </li>

                </ul>

              </div>
            ) : (
              <div className="d-flex gap-2">

                <Link
                  to="/login"
                  className={`btn ${
                    theme === "light"
                      ? "btn-outline-dark"
                      : "btn-outline-light"
                  } rounded-pill px-4`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-gradient rounded-pill px-4"
                >
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