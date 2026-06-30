import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const Profile = () => {
  const { user, logout, updateProfile, fetchProfile, changePassword, deleteAccount } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: false, message: "" });

  const [infoForm, setInfoForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    profilePhoto: ""
  });

  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const result = await fetchProfile();
      const profileUser = result.success ? result.user : user;

      if (profileUser) {
        setInfoForm({
          name: profileUser.name || "",
          email: profileUser.email || "",
          phone: profileUser.phone || "",
          age: profileUser.age ?? "",
          gender: profileUser.gender || "",
          profilePhoto: profileUser.profilePhoto || ""
        });
        setAddressForm({
          street: profileUser.address?.street || "",
          city: profileUser.address?.city || "",
          state: profileUser.address?.state || "",
          zipCode: profileUser.address?.zipCode || "",
          phone: profileUser.address?.phone || ""
        });
      }

      if (!result.success) {
        setFeedback({ error: true, message: result.message || "Unable to load profile." });
      }
      setLoading(false);
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showFeedback = (msg, isErr = false) => {
    setFeedback({ error: isErr, message: msg });
    setTimeout(() => setFeedback({ error: false, message: "" }), 4000);
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({
      name: infoForm.name,
      phone: infoForm.phone,
      age: infoForm.age === "" ? null : Number(infoForm.age),
      gender: infoForm.gender,
      profilePhoto: infoForm.profilePhoto
    });
    setSaving(false);
    showFeedback(res.message, !res.success);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({ address: addressForm });
    setSaving(false);
    showFeedback(res.message, !res.success);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback("New passwords do not match.", true);
      return;
    }

    setSaving(true);
    const res = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    setSaving(false);

    if (res.success) {
      showFeedback(res.message);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      showFeedback(res.message, true);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "This will permanently delete your account. Orders will remain for records, but your login will be removed. Continue?"
    );

    if (!confirmDelete) return;

    setSaving(true);
    const res = await deleteAccount();
    setSaving(false);

    if (res.success) {
      navigate("/login");
    } else {
      showFeedback(res.message, true);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      <div className="max-w-600 mx-auto" style={{ maxWidth: "820px" }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <p className="section-kicker mb-2">My Account</p>
            <h3 className="fw-bold m-0">Profile Center</h3>
            <p className="text-muted small mb-0">Update your personal details, address, and security settings.</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn btn-gradient-secondary rounded-pill px-4 fw-semibold">
            Back
          </button>
        </div>

        {feedback.message && (
          <div className={`alert ${feedback.error ? "alert-danger" : "alert-success"} rounded-4 p-3 mb-4 fw-semibold small`}>
            <i className={`bi-${feedback.error ? "exclamation-triangle-fill" : "check-circle-fill"} me-2`}></i>
            {feedback.message}
          </div>
        )}

        <div className="p-4 p-md-5 rounded-4 border shadow-sm mb-4 luxury-card" style={{ background: theme === "light" ? "rgba(255,255,255,0.86)" : "rgba(17,17,17,0.4)" }}>
          <div className="d-flex flex-column flex-md-row align-items-md-center gap-4 mb-4 pb-4 border-bottom" style={{ borderColor: "var(--color-border)" }}>
            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "92px", height: "92px", fontSize: "2.3rem", background: "var(--color-accent)" }}>
              {infoForm.name ? infoForm.name[0].toUpperCase() : "U"}
            </div>
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h4 className="fw-bold m-0">{infoForm.name || "Your Profile"}</h4>
                <span className="badge-status badge-info">{user?.role || "customer"}</span>
              </div>
              <p className="text-muted small mb-2">Manage your identity and shipping details from one place.</p>
              <div className="d-flex flex-wrap gap-2 small">
                <span className="badge bg-light text-dark border border-secondary border-opacity-10 rounded-pill px-3 py-2">{infoForm.email || "No email"}</span>
                <span className="badge bg-light text-dark border border-secondary border-opacity-10 rounded-pill px-3 py-2">{infoForm.phone || "No phone"}</span>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            <button onClick={() => setActiveTab("info")} className={`btn btn-sm rounded-pill px-3 fw-bold ${activeTab === "info" ? "btn-primary text-white" : "btn-outline-primary"}`}>
              Profile Info
            </button>
            <button onClick={() => setActiveTab("address")} className={`btn btn-sm rounded-pill px-3 fw-bold ${activeTab === "address" ? "btn-primary text-white" : "btn-outline-primary"}`}>
              Address
            </button>
            <button onClick={() => setActiveTab("security")} className={`btn btn-sm rounded-pill px-3 fw-bold ${activeTab === "security" ? "btn-primary text-white" : "btn-outline-primary"}`}>
              Security
            </button>
            <button onClick={() => setActiveTab("danger")} className={`btn btn-sm rounded-pill px-3 fw-bold ${activeTab === "danger" ? "btn-primary text-white" : "btn-outline-primary"}`}>
              Delete Account
            </button>
          </div>

          {activeTab === "info" && (
            <form onSubmit={handleInfoSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">FULL NAME</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={infoForm.name}
                    onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                    required
                    disabled={saving}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">PHONE NUMBER</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    disabled={saving}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">AGE</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    className="form-control form-control-custom"
                    value={infoForm.age}
                    onChange={(e) => setInfoForm({ ...infoForm, age: e.target.value })}
                    placeholder="Your age"
                    disabled={saving}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">GENDER</label>
                  <select
                    className="form-select form-control-custom"
                    value={infoForm.gender}
                    onChange={(e) => setInfoForm({ ...infoForm, gender: e.target.value })}
                    disabled={saving}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">PROFILE PHOTO URL</label>
                  <input
                    type="url"
                    className="form-control form-control-custom"
                    value={infoForm.profilePhoto}
                    onChange={(e) => setInfoForm({ ...infoForm, profilePhoto: e.target.value })}
                    placeholder="Paste a profile photo URL"
                    disabled={saving}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="form-control form-control-custom"
                    value={infoForm.email}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button type="submit" disabled={saving} className="btn btn-gradient rounded-pill px-4 fw-semibold text-white">
                  Save Profile Changes
                </button>
                <button type="button" onClick={() => setActiveTab("address")} className="btn btn-gradient-secondary rounded-pill px-4 fw-semibold">
                  Next: Address
                </button>
              </div>
            </form>
          )}

          {activeTab === "address" && (
            <form onSubmit={handleAddressSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">STREET ADDRESS</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="e.g. 123 Main St, Apartment 4B"
                  disabled={saving}
                />
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">CITY</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    disabled={saving}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">STATE</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    disabled={saving}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">ZIP CODE</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                    placeholder="e.g. 560001"
                    disabled={saving}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">DELIVERY CONTACT</label>
                  <input
                    type="text"
                    className="form-control form-control-custom"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="Mobile number for delivery"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <button type="submit" disabled={saving} className="btn btn-gradient rounded-pill px-4 fw-semibold text-white">
                  Save Shipping Address
                </button>
                <button type="button" onClick={() => setActiveTab("security")} className="btn btn-gradient-secondary rounded-pill px-4 fw-semibold">
                  Next: Security
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">CURRENT PASSWORD</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  disabled={saving}
                />
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button type="submit" disabled={saving} className="btn btn-gradient rounded-pill px-4 fw-semibold text-white">
                  Change Password
                </button>
              </div>
            </form>
          )}

          {activeTab === "danger" && (
            <div className="p-4 rounded-4 border" style={{ background: "color-mix(in srgb, var(--color-danger) 8%, transparent)", borderColor: "rgba(141, 45, 45, 0.25)" }}>
              <h5 className="fw-bold mb-2">Delete Account</h5>
              <p className="text-muted small mb-4">
                This permanently deletes your login profile. Existing order records may remain for business history.
              </p>
              <button onClick={handleDeleteAccount} disabled={saving} className="btn btn-outline-danger rounded-pill px-4 fw-bold">
                <i className="bi-trash3 me-2"></i>Delete My Account
              </button>
            </div>
          )}
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                logout();
                navigate("/login");
              }
            }}
            className="btn btn-gradient-secondary rounded-pill px-4 fw-bold"
          >
            <i className="bi-box-arrow-left me-2"></i>Sign Out
          </button>
          <span className="small text-muted">
            {infoForm.gender ? `${infoForm.gender} • ` : ""}{infoForm.age ? `${infoForm.age} years` : "Age not set"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
