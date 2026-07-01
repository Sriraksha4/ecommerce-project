import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLogin = () => {
  const { login, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user is typing
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const { email, password } = formData;

  if (!email || !password) {
    setError("Please fill in all fields.");
    return;
  }

  if (!validateEmail(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  setLoading(true);

  const result = await login(email, password, true);

  setLoading(false);

  if (result.success) {
    setSuccess("Admin authorization verified! Access granted.");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  } else {
    logout();
    setError(result.message);
  }
};

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center min-vh-100" style={{ background: "radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)" }}>
      <div className="auth-card fade-in p-5 rounded-4 shadow-lg border" style={{ maxWidth: "450px", width: "100%", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
        <div className="text-center mb-4">
          <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3 animate-pulse" style={{ width: "60px", height: "60px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <i className="bi-shield-lock-fill text-danger fs-3"></i>
          </div>
          <h2 className="text-white fw-extrabold mb-1" style={{ letterSpacing: "-0.5px" }}>Admin Portal</h2>
          <p className="text-muted small">Sign in to access administrator command center</p>
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
            <label className="form-label text-muted small fw-bold">ADMIN EMAIL</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom ps-3"
                placeholder="admin@ecommerce.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted small fw-bold">SECURE PASSWORD</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-key text-muted"></i>
              </span>
              <input
                type="password"
                name="password"
                className="form-control form-control-custom ps-3"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
          </div>

          <button
            className="btn btn-danger w-100 mb-3 d-flex align-items-center justify-content-center py-3 border-0"
            type="submit"
            disabled={loading}
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", borderRadius: "10px", fontWeight: "600" }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Authenticating Admin...</span>
              </>
            ) : (
              <span>Authorize Login</span>
            )}
          </button>

          <p className="text-center text-muted small mt-4 mb-0">
            Are you a customer?{" "}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Go to Storefront Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
