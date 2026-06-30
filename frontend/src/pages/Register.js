import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Register = () => {
  const { register } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    password: "", 
    confirmPassword: "" 
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  // Password requirements boolean matches
  const hasMinLen = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasLower = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecial = /[@$!%*?&]/.test(formData.password);
  // Check password strength score (0 to 5) and label
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "None", color: "bg-secondary", width: "0%" };
    
    let score = 0;
    if (hasMinLen) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    switch (score) {
      case 0:
      case 1:
      case 2:
        return { score, label: "Weak", color: "bg-danger", width: "33%" };
      case 3:
      case 4:
        return { score, label: "Medium", color: "bg-warning", width: "66%" };
      case 5:
        return { score, label: "Strong", color: "bg-success", width: "100%" };
      default:
        return { score: 0, label: "None", color: "bg-secondary", width: "0%" };
    }
  };
  const strength = getPasswordStrength(formData.password);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { name, email, phone, password, confirmPassword } = formData;
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (name.trim().length < 3) {
      setError("Name must contain at least 3 characters.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!hasMinLen || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError("Password does not meet all strong security criteria.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const result = await register(name, email, phone, password, confirmPassword);
    setLoading(false);
    if (result.success) {
      setSuccess("Account registered successfully! Redirecting to login...");
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message);
    }
  };
  return (
    <div className="auth-bg">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: "60px", height: "60px" }}>
            <i className="bi-person-plus-fill text-primary fs-3"></i>
          </div>
          <h2 className="text-white fw-extrabold mb-1">Create Account</h2>
          <p className="text-muted small">Register to start shopping on AuraCommerce</p>
        </div>
        {error && (
          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 mb-4 d-flex align-items-center" role="alert">
            <i className="bi-exclamation-triangle-fill me-2 fs-5"></i>
            <span className="small fw-semibold">{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 d-flex align-items-center" role="alert">
            <i className="bi-check-circle-fill me-2 fs-5"></i>
            <span className="small fw-semibold">{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">FULL NAME</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-person text-muted"></i>
              </span>
              <input
                type="text"
                name="name"
                className="form-control form-control-custom ps-3"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom ps-3"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">PHONE NUMBER</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-telephone text-muted"></i>
              </span>
              <input
                type="text"
                name="phone"
                className="form-control form-control-custom ps-3"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-muted small fw-bold">PASSWORD</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-key text-muted"></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control form-control-custom ps-3"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
            {/* Live Password Strength Meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="extra-small text-muted" style={{ fontSize: "0.75rem" }}>
                    Password Strength: <strong className={strength.score === 5 ? "text-success" : strength.score >= 3 ? "text-warning" : "text-danger"}>{strength.label}</strong>
                  </span>
                </div>
                <div className="password-strength-meter">
                  <div 
                    className={`password-strength-bar ${strength.color}`} 
                    style={{ width: strength.width }}
                  ></div>
                </div>
              </div>
            )}
            {/* Live Requirements Checklist */}
            {formData.password && (
              <div className="mt-3 p-3 rounded" style={{ background: "rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.03)" }}>
                <label className="text-muted extra-small fw-bold mb-2 d-block">PASSWORD REQUIREMENTS</label>
                <div className="d-flex flex-column gap-1" style={{ fontSize: "0.75rem" }}>
                  <div className={hasMinLen ? "text-success" : "text-muted"}>
                    <i className={hasMinLen ? "bi-check-circle-fill me-2" : "bi-circle me-2"}></i>Min 8 characters
                  </div>
                  <div className={hasUpper ? "text-success" : "text-muted"}>
                    <i className={hasUpper ? "bi-check-circle-fill me-2" : "bi-circle me-2"}></i>Contains uppercase letter
                  </div>
                  <div className={hasLower ? "text-success" : "text-muted"}>
                    <i className={hasLower ? "bi-check-circle-fill me-2" : "bi-circle me-2"}></i>Contains lowercase letter
                  </div>
                  <div className={hasNumber ? "text-success" : "text-muted"}>
                    <i className={hasNumber ? "bi-check-circle-fill me-2" : "bi-circle me-2"}></i>Contains number
                  </div>
                  <div className={hasSpecial ? "text-success" : "text-muted"}>
                    <i className={hasSpecial ? "bi-check-circle-fill me-2" : "bi-circle me-2"}></i>Contains special char (@$!%*?&)
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="form-label text-muted small fw-bold">CONFIRM PASSWORD</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-shield-check text-muted"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                className="form-control form-control-custom ps-3"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
          </div>
          <button
            className="btn btn-gradient w-100 mb-3 d-flex align-items-center justify-content-center py-3 text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
          <p className="text-center text-muted small mt-4 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Register;