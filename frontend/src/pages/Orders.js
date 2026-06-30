import React, { useState, useEffect } from "react";
import API from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock Order Form States
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [orderAmount, setOrderAmount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        API.get("/orders"),
        API.get("/products"),
        API.get("/customers"),
      ]);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCustomers(customersRes.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order data. Make sure the backend is active.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setError("");
    setSuccess("");
    try {
      const response = await API.put(`/orders/${orderId}`, { status: newStatus });
      setSuccess(response.data.message || `Order status updated to ${newStatus}.`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status.");
    }
  };

  // Calculate order total when items selection changes
  useEffect(() => {
    let total = 0;
    selectedProductIds.forEach((pid) => {
      const p = products.find((prod) => prod._id === pid);
      if (p) total += p.price;
    });
    setOrderAmount(total);
  }, [selectedProductIds, products]);

  const handleProductSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedProductIds(selected);
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCustomerId || selectedProductIds.length === 0) {
      setError("Please select a customer and at least one product.");
      return;
    }

    try {
      const response = await API.post("/orders", {
        products: selectedProductIds,
        totalAmount: orderAmount,
        // The backend uses req.user.id to assign the order user.
        // But wait! If we are admins, let's see how addOrder is implemented in backend:
        // const order = new Order({ user: req.user.id, products, totalAmount });
        // So the order is created under the currently logged-in admin user.
        // That is fine, the API automatically grabs the authenticated user's ID.
      });
      setSuccess(response.data.message || "Order created successfully.");
      setShowAddOrderModal(false);
      setSelectedCustomerId("");
      setSelectedProductIds([]);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create order.");
    }
  };

  // Filter orders by customer name or email
  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.name || "";
    const customerEmail = order.user?.email || "";
    const orderId = order._id || "";
    return (
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      orderId.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getStatusSummary = (status) => {
    return orders.filter((o) => o.status?.toLowerCase() === status.toLowerCase()).length;
  };

  return (
    <div className="fade-in">
      {/* Alert Banners */}
      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 mb-4 d-flex align-items-center">
          <i className="bi-exclamation-triangle-fill me-2 fs-5"></i>
          <span className="small fw-semibold">{error}</span>
        </div>
      )}
      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 d-flex align-items-center">
          <i className="bi-check-circle-fill me-2 fs-5"></i>
          <span className="small fw-semibold">{success}</span>
        </div>
      )}

      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="text-white fw-bold m-0">Orders Tracking</h2>
          <p className="text-muted small mb-0">Update fulfillment status, manage sales cycles, and create test receipts</p>
        </div>
        <button
          onClick={() => {
            setSelectedCustomerId("");
            setSelectedProductIds([]);
            setShowAddOrderModal(true);
          }}
          className="btn btn-gradient d-flex align-items-center"
        >
          <i className="bi-plus-circle me-2"></i> Create Mock Order
        </button>
      </div>

      {/* Summary Row */}
      {!loading && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3" style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.15)" }}>
              <div className="text-warning small fw-bold">PENDING</div>
              <h4 className="text-white fw-bold m-0 mt-1">{getStatusSummary("Pending")}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3" style={{ background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.15)" }}>
              <div className="text-primary small fw-bold">SHIPPED</div>
              <h4 className="text-white fw-bold m-0 mt-1">{getStatusSummary("Shipped")}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
              <div className="text-success small fw-bold">DELIVERED</div>
              <h4 className="text-white fw-bold m-0 mt-1">{getStatusSummary("Delivered")}</h4>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-3 rounded-3" style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
              <div className="text-danger small fw-bold">CANCELLED</div>
              <h4 className="text-white fw-bold m-0 mt-1">{getStatusSummary("Cancelled")}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="position-relative">
            <i className="bi-search text-muted position-absolute top-50 start-3 translate-middle-y ms-3"></i>
            <input
              type="text"
              placeholder="Search by customer name, email, or order ID..."
              className="form-control form-control-custom ps-5 py-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="table-container p-5 text-center text-muted">
          <i className="bi-cart-x fs-1 mb-2"></i>
          <p className="mb-0">No orders matching the search criteria found.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS DETAILS</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th className="text-center" style={{ width: "160px" }}>Fulfillment Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className="text-white small fw-bold" title={order._id}>
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-white mb-0">{order.user?.name || "Deleted Customer"}</div>
                      <div className="text-muted small" style={{ fontSize: "0.75rem" }}>{order.user?.email || ""}</div>
                    </td>
                    <td>
                      <div className="text-white small fw-semibold">
                        {order.products?.length || 0} product(s)
                      </div>
                      <div className="text-muted extra-small text-truncate" style={{ maxWidth: "200px", fontSize: "0.75rem" }} title={order.products?.map((p) => p.name).join(", ")}>
                        {order.products?.map((p) => p.name).join(", ") || "No items listed"}
                      </div>
                    </td>
                    <td className="fw-bold text-white">${order.totalAmount?.toLocaleString("en-IN") || "0"}</td>
                    <td>
                      <span className={`badge-status badge-${order.status?.toLowerCase() || "pending"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="small text-muted" style={{ fontSize: "0.8rem" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <select
                        className="form-select form-control-custom py-1 px-2 border-secondary border-opacity-25"
                        style={{ fontSize: "0.85rem" }}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mock Order Modal */}
      {showAddOrderModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h5 className="modal-title fw-bold text-white">Create Mock Order</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddOrderModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateOrderSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">SELECT CUSTOMER</label>
                    <select
                      className="form-select form-control-custom"
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      required
                    >
                      <option value="">Choose User...</option>
                      {customers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">SELECT PRODUCTS (Ctrl + Click to select multiple)</label>
                    <select
                      multiple
                      className="form-select form-control-custom"
                      style={{ height: "130px" }}
                      value={selectedProductIds}
                      onChange={handleProductSelect}
                      required
                    >
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} - ${p.price} (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">Selected Items:</span>
                      <span className="text-white fw-bold">{selectedProductIds.length}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2 border-top border-secondary border-opacity-10 pt-2">
                      <span className="text-muted small fw-bold">Total Amount:</span>
                      <span className="text-primary fw-extrabold fs-5">${orderAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer modal-footer-custom">
                  <button
                    type="button"
                    className="btn btn-gradient-secondary"
                    onClick={() => setShowAddOrderModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gradient">
                    Submit Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
