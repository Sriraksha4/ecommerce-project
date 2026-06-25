import React, { useState, useEffect } from "react";
import API from "../services/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Wait, let's verify where all customers are fetched. In user routes:
      // router.get("/", protect, getAllUsers);
      // Let's call /users since user routing fetches users list under /users
      const response = await API.get("/users");
      setCustomers(response.data || []);
      setError("");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load customer details. Make sure you are logged in as an Admin.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (customer) => {
    if (customer.role === "admin") {
      alert("Admin accounts cannot be deactivated via this panel.");
      return;
    }
    
    const confirmMsg = `Are you sure you want to ${customer.isActive ? "DEACTIVATE" : "ACTIVATE"} ${customer.name}'s account?`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      // call PUT /api/users/status/:id
      const response = await API.put(`/users/status/${customer._id}`);
      showToast(response.data.message || "User status updated successfully.");
      
      // Update local state directly
      setCustomers((prev) => 
        prev.map((c) => (c._id === customer._id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to update user status.");
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));
    const matchesRole = filterRole ? c.role === filterRole : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-dark border-0 rounded-3 shadow-lg" role="alert">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi-info-circle-fill me-2 text-primary"></i>
                {toastMessage}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage("")}></button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 mb-4 d-flex align-items-center">
          <i className="bi-exclamation-triangle-fill me-2 fs-5"></i>
          <span className="small fw-semibold">{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-white fw-bold m-0">Customer Database</h2>
        <p className="text-muted small mb-0">Manage customer accounts, deactivations, and review profiles</p>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-8">
          <div className="position-relative">
            <i className="bi-search text-muted position-absolute top-50 start-3 translate-middle-y ms-3"></i>
            <input
              type="text"
              placeholder="Search by customer name, email or phone..."
              className="form-control form-control-custom ps-5 py-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="position-relative">
            <i className="bi-shield-check text-muted position-absolute top-50 start-3 translate-middle-y ms-3"></i>
            <select
              className="form-select form-control-custom ps-5 py-3"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="table-container p-5 text-center text-muted rounded-4 border border-secondary border-opacity-10">
          <i className="bi-people fs-1 mb-2"></i>
          <p className="mb-0">No users found matching the filter criteria.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>AVATAR</th>
                  <th>FULL NAME</th>
                  <th>EMAIL ADDRESS</th>
                  <th>PHONE</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div 
                        className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold bg-primary bg-opacity-25 text-primary border border-primary border-opacity-10"
                        style={{ width: "40px", height: "40px", fontSize: "0.95rem" }}
                      >
                        {c.name ? c.name[0].toUpperCase() : "U"}
                      </div>
                    </td>
                    <td>
                      <span className="fw-bold text-white">{c.name}</span>
                    </td>
                    <td>
                      <span className="text-white">{c.email}</span>
                    </td>
                    <td>
                      <span className="text-muted small">{c.phone || "Not Set"}</span>
                    </td>
                    <td>
                      <span className={`badge bg-${c.role === "admin" ? "danger" : "secondary"} bg-opacity-25 text-${c.role === "admin" ? "danger" : "white"} border border-${c.role === "admin" ? "danger" : "secondary"} border-opacity-25 px-3 py-1 text-capitalize`}>
                        {c.role || "customer"}
                      </span>
                    </td>
                    <td>
                      {c.isActive !== false ? (
                        <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25 px-2 py-1">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-danger bg-opacity-15 text-danger border border-danger border-opacity-25 px-2 py-1">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td>
                      {c.role !== "admin" ? (
                        <div className="form-check form-switch m-0 p-0 d-flex align-items-center">
                          <input 
                            className="form-check-input pointer ms-0" 
                            type="checkbox" 
                            role="switch" 
                            checked={c.isActive !== false}
                            onChange={() => handleToggleStatus(c)}
                          />
                        </div>
                      ) : (
                        <span className="text-muted extra-small">Immutable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
