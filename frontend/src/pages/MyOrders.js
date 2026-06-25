import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { getProductImage } from "../services/utils";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get("/orders");
      // Filter orders belonging to the logged-in customer
      const filtered = (response.data || []).filter(
        (order) => order.user?._id === user?._id
      );
      setUserOrders(filtered.reverse());
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load your orders history. Make sure the backend server is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserOrders();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }
    try {
      const response = await API.put(`/orders/${orderId}`, { status: "Cancelled" });
      showToast(response.data.message || "Order cancelled successfully.");
      fetchUserOrders(); // Reload orders list
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  const printInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print/view the invoice.");
      return;
    }
    const sub = Math.round(order.totalAmount * 0.82);
    const gst = Math.round(order.totalAmount * 0.18);
    const shipping = order.totalAmount > 1500 ? "FREE" : "$150";

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - AuraCommerce</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 40px; color: #0f172a; }
            .invoice-card { border: 1px solid rgba(0,0,0,0.1); border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          </style>
        </head>
        <body onload="window.print();">
          <div class="container invoice-card mt-4">
            <div class="d-flex justify-content-between mb-4">
              <div>
                <h3 class="fw-bold text-primary">AuraCommerce</h3>
                <p class="text-muted small mb-0">Premium Retail Merchants</p>
                <p class="text-muted extra-small">support@auracommerce.com</p>
              </div>
              <div class="text-end">
                <h5 class="fw-bold text-uppercase">Tax Invoice</h5>
                <p class="small text-muted mb-0">Invoice Reference: #${order._id.substring(18).toUpperCase()}</p>
                <p class="small text-muted">Order Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <hr>
            <div class="row mb-4">
              <div class="col-6">
                <strong class="small text-muted text-uppercase d-block mb-1">Billing Details:</strong>
                <p class="fw-bold mb-0">${order.shippingAddress?.fullName || user?.name || "Customer"}</p>
                <p class="small text-muted mb-0">${order.shippingAddress?.street || "Street Address Not Available"}</p>
                <p class="small text-muted">${order.shippingAddress?.city || "City"} - ${order.shippingAddress?.zipCode || "Zip"}</p>
              </div>
              <div class="col-6 text-end">
                <strong class="small text-muted text-uppercase d-block mb-1">Contact:</strong>
                <p class="small text-muted mb-0">Phone: ${order.shippingAddress?.phone || user?.phone || "N/A"}</p>
                <p class="small text-muted">Email: ${user?.email}</p>
              </div>
            </div>
            <table class="table table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Product Description</th>
                  <th style="width:120px;">Category</th>
                  <th class="text-end" style="width:100px;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.products.map(p => p ? `
                  <tr>
                    <td>
                      <div class="fw-bold">${p.name}</div>
                      <div class="text-muted small">${p.brand || "Aura Brand"}</div>
                    </td>
                    <td>${p.category}</td>
                    <td class="text-end">$${p.price}</td>
                  </tr>
                ` : '').join('')}
              </tbody>
            </table>
            <div class="row justify-content-end mt-4">
              <div class="col-5">
                <table class="table table-sm table-borderless">
                  <tr>
                    <td class="text-muted">Subtotal:</td>
                    <td class="text-end fw-semibold">$${sub}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">GST (18%):</td>
                    <td class="text-end fw-semibold">$${gst}</td>
                  </tr>
                  <tr>
                    <td class="text-muted">Shipping Charges:</td>
                    <td class="text-end text-success fw-bold">${shipping}</td>
                  </tr>
                  <tr class="border-top">
                    <td class="fw-bold text-primary fs-5 pt-2">Paid Balance:</td>
                    <td class="text-end fw-bold text-primary fs-5 pt-2">$${order.totalAmount}</td>
                  </tr>
                </table>
              </div>
            </div>
            <hr class="mt-5">
            <p class="text-center text-muted extra-small">Thank you for shopping at AuraCommerce! Keep this receipt for warranty claims.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderTimeline = (status) => {
    if (status === "Cancelled") {
      return (
        <div className="alert alert-danger py-2 px-3 rounded-3 small fw-semibold m-0 mt-3 d-flex align-items-center gap-2">
          <i className="bi-x-circle-fill"></i> This order has been cancelled and inventory released.
        </div>
      );
    }
    
    const steps = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIdx = steps.indexOf(status);

    return (
      <div className="mt-4 py-2 border-top" style={{ borderColor: "var(--card-border)" }}>
        <span className="text-muted extra-small fw-bold text-uppercase d-block mb-3">Order Status Tracking</span>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {steps.map((step, idx) => {
            const isDone = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <React.Fragment key={step}>
                <div className="d-flex align-items-center gap-2">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-white`} 
                    style={{ 
                      width: "26px", 
                      height: "26px", 
                      fontSize: "0.75rem",
                      background: isDone ? "var(--primary-color)" : "rgba(255,255,255,0.1)"
                    }}
                  >
                    {isCurrent ? <i className="bi-play-fill"></i> : idx + 1}
                  </div>
                  <span className={`small fw-semibold ${isCurrent ? "text-primary" : isDone ? "text-reset" : "text-muted"}`}>
                    {step}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div 
                    className="flex-grow-1" 
                    style={{ 
                      height: "2px", 
                      minWidth: "20px", 
                      background: idx < currentIdx ? "var(--primary-color)" : "var(--card-border)" 
                    }}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Retrieving your orders...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show align-items-center text-white bg-dark border-0 rounded-3 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
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

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold m-0">My Orders</h2>
          <p className="text-muted m-0">Review shipment trackers and download invoices</p>
        </div>
        <Link to="/shop" className="btn btn-outline-primary rounded-pill">
          <i className="bi-shop me-2"></i>Go to Shop
        </Link>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {userOrders.length === 0 ? (
        <div 
          className="text-center py-5 rounded-4 border border-dashed"
          style={{ 
            borderColor: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
            background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)" 
          }}
        >
          <div className="display-4 text-muted mb-3">
            <i className="bi-receipt"></i>
          </div>
          <h4 className="fw-semibold">No Orders Found</h4>
          <p className="text-muted max-w-600 mx-auto px-3">
            You haven't placed any orders yet. Visit the catalog to add items to your cart and experience AuraCommerce.
          </p>
          <Link to="/shop" className="btn btn-gradient rounded-pill px-4 mt-2">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {userOrders.map((order) => {
            const canCancel = order.status === "Pending" || order.status === "Processing";
            return (
              <div 
                key={order._id}
                className="p-4 rounded-4 shadow-sm border"
                style={{ 
                  background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.35)", 
                  borderColor: "var(--card-border)" 
                }}
              >
                {/* Order Header Panel */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-3 mb-3" style={{ borderColor: "var(--card-border)" }}>
                  <div>
                    <span className="text-muted small fw-bold">ORDER ID:</span>{" "}
                    <strong className="text-uppercase" style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      #{order._id}
                    </strong>
                    <div className="text-muted extra-small mt-1">
                      Placed on: {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-3">
                    <div>
                      <span className="text-muted small me-2">Total Paid:</span>
                      <strong className="text-primary fw-extrabold fs-5">
                        ${order.totalAmount}
                      </strong>
                    </div>
                    <span className={`badge-status badge-${order.status?.toLowerCase() || "pending"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Products list */}
                <div className="d-flex flex-column gap-3 mb-3">
                  {order.products?.map((product, idx) => {
                    if (!product) return null;
                    return (
                      <div 
                        key={`${product._id}-${idx}`}
                        className="d-flex align-items-center justify-content-between py-2 border-bottom"
                        style={{ borderColor: "rgba(255,255,255,0.03)" }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="rounded-3 border"
                            style={{ width: "55px", height: "55px", objectFit: "contain", background: "#fff", borderColor: "var(--card-border)" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
                            }}
                          />
                          <div>
                            <div className="fw-bold small">{product.name}</div>
                            <div className="text-muted extra-small" style={{ fontSize: "0.75rem" }}>{product.category}</div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold small">${product.price}</div>
                          <span className="extra-small text-muted" style={{ fontSize: "0.7rem" }}>Quantity: 1</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-2 justify-content-end">
                  <button 
                    onClick={() => printInvoice(order)} 
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold"
                  >
                    <i className="bi-receipt me-1"></i> Print Invoice
                  </button>
                  {canCancel && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)} 
                      className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
                    >
                      <i className="bi-x-circle me-1"></i> Cancel Order
                    </button>
                  )}
                </div>

                {/* Timeline Status */}
                {renderTimeline(order.status)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
