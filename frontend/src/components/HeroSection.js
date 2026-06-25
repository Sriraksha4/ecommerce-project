import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div 
      className="p-5 rounded-4 mb-5 text-start position-relative overflow-hidden" 
      style={{ 
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)", 
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
      }}
    >
      {/* Background glow graphics */}
      <div 
        className="position-absolute" 
        style={{ 
          width: "250px", 
          height: "250px", 
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)", 
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
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 px-3 py-2 mb-3 rounded-pill fw-semibold" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
            EXCLUSIVELY FOR YOU &bull; UP TO 40% OFF
          </span>
          <h1 className="display-4 fw-extrabold text-white mb-3" style={{ lineHeight: "1.2" }}>
            Discover the Future <br />
            of E-Commerce Shopping
          </h1>
          <p className="lead text-muted mb-4 fs-6 lh-lg" style={{ maxWidth: "600px" }}>
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
              className="position-absolute bg-primary bg-opacity-20 rounded-circle filter blur" 
              style={{ width: "300px", height: "300px", zIndex: "-1", top: "-20px", left: "-20px", filter: "blur(40px)" }}
            ></div>
            <i 
              className="bi-bag-check-fill text-primary" 
              style={{ fontSize: "12rem", filter: "drop-shadow(0 15px 30px rgba(59,130,246,0.3))" }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
