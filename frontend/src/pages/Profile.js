import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Profile = () => {
  const { user, logout, updateProfile, changePassword } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Tab State: "info", "address", "security"
  const [activeTab, setActiveTab] = useState("info");

  // Form states
  const [infoForm, setInfoForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profilePhoto: user?.profilePhoto || ""
  });

  const [addressForm, setAddressForm] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    phone: user?.address?.phone || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [feedback, setFeedback] = useState({ error: false, message: "" });
  const [loading, setLoading] = useState(false);

  const showFeedback = (msg, isErr = false) => {
    setFeedback({ error: isErr, message: msg });
    setTimeout(() => setFeedback({ error: false, message: "" }), 4000);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile(infoForm);
    setLoading(false);
    if (res.success) {
      showFeedback(res.message);
    } else {
      showFeedback(res.message, true);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile({ address: addressForm });
    setLoading(false);
    if (res.success) {
      showFeedback(res.message);
    } else {
      showFeedback(res.message, true);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback("New passwords do not match.", true);
      return;
    }
    setLoading(true);
    const res = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    setLoading(false);
    if (res.success) {
      showFeedback(res.message);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      showFeedback(res.message, true);
    }
  };

  return (
    <div className="container py-4 fade-in">
      <div className="max-w-600 mx-auto" style={{ maxWidth: "700px" }}>
        <h3 className="fw-bold mb-4">My Account Profile</h3>

        {feedback.message && (
          <div className={`alert ${feedback.error ? "alert-danger" : "alert-success"} rounded-3 p-3 mb-4 fw-semibold small`}>
            <i className={`bi-${feedback.error ? "exclamation-triangle-fill" : "check-circle-fill"} me-2`}></i>
            {feedback.message}
          </div>
        )}

        <div 
          className="p-4 rounded-4 border shadow-sm mb-4"
          style={{ 
            background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.35)", 
            borderColor: "var(--card-border)" 
          }}
        >
          {/* Avatar and Info Header */}
          <div className="d-flex align-items-center gap-4 mb-4 pb-3 border-bottom" style={{ borderColor: "var(--card-border)" }}>
            <div 
              className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center fw-bold border border-primary border-opacity-25"
              style={{ width: "80px", height: "80px", fontSize: "2.2rem" }}
            >
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h4 className="fw-extrabold m-0">{user?.name}</h4>
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-2 py-1 rounded-pill mt-1 small text-capitalize">
                Role: {user?.role || "Customer"}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <ul className="nav nav-pills gap-2 mb-4">
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab("info")} 
                className={`btn btn-sm rounded-pill px-3 fw-bold ${activeTab === "info" ? "btn-primary text-white" : "btn-dark border border-secondary border-opacity-10 text-muted"}`}
              >
                Profile Info
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab("address")} 
                className={`btn btn-sm rounded-pill px-3 fw-bold ${activeTab === "address" ? "btn-primary text-white" : "btn-dark border border-secondary border-opacity-10 text-muted"}`}
              >
                Address Details
              </button>
            </li>
            <li className="nav-item">
              <button 
                onClick={() => setActiveTab("security")} 
                className={`btn btn-sm rounded-pill px-3 fw-bold ${activeTab === "security" ? "btn-primary text-white" : "btn-dark border border-secondary border-opacity-10 text-muted"}`}
              >
                Change Password
              </button>
            </li>
          </ul>

          {/* Tab 1: Profile Info */}
          {activeTab === "info" && (
            <form onSubmit={handleInfoSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">FULL NAME</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">EMAIL ADDRESS (Read Only)</label>
                <input
                  type="email"
                  className="form-control text-muted"
                  style={{ background: theme === "light" ? "#e2e8f0" : "rgba(15,23,42,0.3)", color: "var(--text-main)" }}
                  value={infoForm.email}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">PHONE NUMBER</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  value={infoForm.phone}
                  onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary rounded-pill px-4 fw-semibold text-white">
                Save Profile Changes
              </button>
            </form>
          )}

          {/* Tab 2: Address Details */}
          {activeTab === "address" && (
            <form onSubmit={handleAddressSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">STREET ADDRESS</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="e.g. 123 Main St, Apartment 4B"
                  disabled={loading}
                />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">CITY</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    disabled={loading}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">STATE</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">ZIP CODE</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    placeholder="e.g. 560001"
                    disabled={loading}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">DELIVERY CONTACT</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="Mobile number for delivery..."
                    disabled={loading}
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary rounded-pill px-4 fw-semibold text-white">
                Save Shipping Address
              </button>
            </form>
          )}

          {/* Tab 3: Security & Passwords */}
          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">CURRENT PASSWORD</label>
                <input
                  type="password"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary rounded-pill px-4 fw-semibold text-white">
                Change Account Password
              </button>
            </form>
          )}
        </div>

        {/* Logout section */}
        <button 
          onClick={() => { if (window.confirm("Are you sure you want to logout?")) { logout(); navigate("/login"); } }} 
          className="btn btn-outline-danger w-100 py-3 rounded-pill fw-bold"
        >
          <i className="bi-box-arrow-left me-2"></i>Sign Out of AuraCommerce
        </button>
      </div>
    </div>
  );
};

export default Profile;
