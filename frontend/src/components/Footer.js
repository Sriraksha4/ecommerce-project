import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="py-5 footer-luxury">
      <div className="container">
        <div className="row g-4">
          {/* Brand info */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold d-flex align-items-center mb-3 footer-brand-luxury">
              <i className="bi-bag-heart-fill me-2"></i> Commerce
            </h5>
            <p className="small lh-lg">
              Explore premium products curated for your daily lifestyle. Shop with speed, security, and full tracking dashboards.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#fb" className="text-muted fs-5"><i className="bi-facebook"></i></a>
              <a href="#tw" className="text-muted fs-5"><i className="bi-twitter-x"></i></a>
              <a href="#ig" className="text-muted fs-5"><i className="bi-instagram"></i></a>
              <a href="#yt" className="text-muted fs-5"><i className="bi-youtube"></i></a>
            </div>
          </div>
          {/* Links 1 */}
          <div className="col-6 col-md-2 offset-md-1">
            <h6 className="fw-bold small mb-3">QUICK LINKS</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-muted text-decoration-none hover-text-white">Home</Link></li>
              <li><Link to="/shop" className="text-muted text-decoration-none hover-text-white">Shop Catalog</Link></li>
              <li><Link to="/cart" className="text-muted text-decoration-none hover-text-white">Shopping Cart</Link></li>
            </ul>
          </div>
          {/* Links 2 */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold small mb-3">ACCOUNT</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/profile" className="text-muted text-decoration-none hover-text-white">My Profile</Link></li>
              <li><Link to="/my-orders" className="text-muted text-decoration-none hover-text-white">Order History</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none hover-text-white">Sign In</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold small mb-3">STORE LOCATION</h6>
            <p className="small lh-lg mb-2">
              <i className="bi-geo-alt me-2 text-primary"></i> 102 E-Commerce Park, Tech Zone, Bengaluru, India
            </p>
            <p className="small mb-2">
              <i className="bi-envelope me-2 text-primary"></i> support@ecommerce.com
            </p>
            <p className="small">
              <i className="bi-telephone me-2 text-primary"></i> +91 80 4910 2000
            </p>
          </div>
        </div>
        {/* Divider */}
        <hr className="my-4 border-secondary border-opacity-10" />
        {/* Copyright */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <p className="small mb-0 text-muted">
            &copy; {new Date().getFullYear()} E-Commerce Inc. All rights reserved.
          </p>
          <div className="d-flex gap-3 small text-muted">
            <a href="#privacy" className="text-muted text-decoration-none">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#terms" className="text-muted text-decoration-none">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
