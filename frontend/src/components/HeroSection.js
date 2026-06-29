import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="hero-shell p-4 p-lg-5 mb-5 text-start">
      {/* Background glow graphics */}
      <div 
        className="position-absolute" 
        style={{ 
          width: "250px", 
          height: "250px", 
          background: "radial-gradient(circle, rgba(143,107,61,0.18) 0%, rgba(0,0,0,0) 70%)", 
          top: "-50px", 
          right: "-50px",
          pointerEvents: "none"
        }}
      ></div>
      <div 
        className="position-absolute" 
        style={{ 
          width: "350px", 
          height: "350px", 
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0) 70%)", 
          bottom: "-100px", 
          left: "20%",
          pointerEvents: "none"
        }}
      ></div>

      <div className="row align-items-center py-4 position-relative z-1">
        <div className="col-12 col-lg-7">
          <span className="eyebrow mb-3">
            Exclusively for you
          </span>
          <h1 className="hero-display fw-semibold mb-3" style={{ lineHeight: "0.95" }}>
            Discover the Future <br />
            of E-Commerce Shopping
          </h1>
          <p className="lead mb-4 fs-6 lh-lg max-w-600" style={{ color: "var(--text-muted)" }}>
            Step into the next-generation shopping catalog. Explore our curation of electronics, apparel, and lifestyle items. Fully responsive tracking, order pipelines, and an administrative panel powered by AI.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-gradient px-4 py-3 rounded-3 d-flex align-items-center">
              <i className="bi-shop me-2"></i> Shop Collection
            </Link>
            <a href="#featured" className="btn btn-gradient-secondary px-4 py-3 rounded-3 d-flex align-items-center">
              Explore Featured
            </a>
          </div>
        </div>
        <div className="col-12 col-lg-5 d-none d-lg-block text-center">
          <div className="position-relative d-inline-block">
            <div 
              className="position-absolute rounded-circle" 
              style={{ width: "300px", height: "300px", zIndex: "-1", top: "-20px", left: "-20px", filter: "blur(40px)", background: "rgba(143,107,61,0.14)" }}
            ></div>
            <i 
              className="bi-bag-check-fill" 
              style={{ fontSize: "12rem", color: "var(--color-accent)", filter: "drop-shadow(0 15px 30px rgba(143,107,61,0.22))", animation: "floatGentle 5s ease-in-out infinite" }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
