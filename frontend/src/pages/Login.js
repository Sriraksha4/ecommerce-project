import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
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
    setError(""); // Clear error when user typing
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
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        if (result.user && result.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card fade-in">
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3" style={{ width: "60px", height: "60px" }}>
            <i className="bi-shield-lock-fill text-primary fs-3"></i>
          </div>
          <h2 className="text-white fw-extrabold mb-1">Welcome Back</h2>
          <p className="text-muted small">Sign in to manage your e-commerce operations</p>
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
            <label className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-secondary border-opacity-25" style={{ borderRadius: "10px 0 0 10px" }}>
                <i className="bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                name="email"
                className="form-control form-control-custom ps-3"
                placeholder="admin@aura.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                style={{ borderRadius: "0 10px 10px 0" }}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between mb-1">
              <label className="form-label text-muted small fw-bold mb-0">PASSWORD</label>
              <a href="#forgot" className="text-primary small text-decoration-none fw-semibold">Forgot?</a>
            </div>
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
            className="btn btn-gradient w-100 mb-3 d-flex align-items-center justify-content-center py-3"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <p className="text-center text-muted small mt-4 mb-0">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary text-decoration-none fw-semibold">
              Create Account
            </Link>
          </p>

          <div className="text-center mt-3 pt-3 border-top border-secondary border-opacity-10">
            <Link to="/admin-login" className="text-muted small text-decoration-none fw-semibold">
              <i className="bi-shield-lock me-1"></i> Staff / Admin Portal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;