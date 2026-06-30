import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import API from "../services/api";
import { getProductImage, formatCurrency } from "../services/utils";

const Checkout = () => {
  const { 
    cart, 
    clearCart,
    subtotal, 
    coupon, 
    discountAmount, 
    gstAmount, 
    shippingFee, 
    grandTotal 
  } = useContext(CartContext);
  
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod", "upi", "card"
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Autofill shipping details from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        zipCode: user.address?.zipCode || "",
        phone: user.phone || user.address?.phone || "",
      });
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !success) {
      navigate("/cart");
    }
  }, [cart, success, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullName, address, city, zipCode, phone } = formData;
    if (!fullName || !address || !city || !zipCode || !phone) {
      setError("Please fill in all shipping details.");
      return;
    }

    if (paymentMethod === "upi" && !paymentDetails.upiId) {
      setError("Please enter a valid UPI ID (e.g. user@okaxis).");
      return;
    }
    if (paymentMethod === "card" && (!paymentDetails.cardNumber || !paymentDetails.cardExpiry || !paymentDetails.cardCvv)) {
      setError("Please fill in all credit card details.");
      return;
    }

    setLoading(true);

    try {
      // Aggregate product IDs
      const productIds = [];
      cart.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          productIds.push(item.product._id);
        }
      });

      const response = await API.post("/orders", {
        products: productIds,
        totalAmount: grandTotal,
        shippingAddress: {
          street: address,
          city,
          state: city, // fallback state to city
          zipCode,
          phone
        },
        paymentMethod
      });

      setSuccess(response.data.message || "Order placed successfully! Aura Trust Delivery initiated.");
      clearCart();
      
      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to process order checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 fade-in">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-8 text-center py-5">
            {/* Loading skeletons for checkout validation */}
            <div className="spinner-border text-primary fs-3 mb-4" role="status" style={{ width: "3.5rem", height: "3.5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="fw-bold animate-pulse text-white">Authorizing Secure Transaction...</h4>
            <p className="text-muted small max-w-600 mx-auto mt-2">
              Please do not refresh the page or click back. We are communicating with server protocols to verify details, reserve stocks, and process invoicing.
            </p>
            <div className="mt-4 max-w-600 mx-auto">
              <div className="password-strength-meter">
                <div className="password-strength-bar bg-primary" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      <h3 className="fw-bold mb-4">Secure Checkout</h3>

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

      <div className="row g-4">
        {/* Shipping Form Left */}
        <div className="col-12 col-lg-7">
          <div 
            className="p-4 rounded-4 shadow-sm border"
            style={{ 
              background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.4)", 
              borderColor: "var(--card-border)" 
            }}
          >
            <h5 className="fw-bold mb-4 d-flex align-items-center">
              <i className="bi-truck text-primary me-2"></i> Shipping & Billing Address
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">RECIPIENT FULL NAME</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">STREET ADDRESS</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  placeholder="Apartment, suite, unit, building, floor, street number..."
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">CITY</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-muted small fw-bold">ZIP CODE</label>
                  <input
                    type="text"
                    name="zipCode"
                    className="form-control"
                    style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                    placeholder="e.g. 560001"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">CONTACT NUMBER</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                  placeholder="10-digit mobile number..."
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Payment Toggles */}
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold mb-3">SELECT PAYMENT METHOD</label>
                <div className="d-flex flex-column gap-2">
                  <div 
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3 rounded-3 border pointer d-flex align-items-center justify-content-between`}
                    style={{ 
                      background: theme === "light" ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.02)",
                      borderColor: paymentMethod === "cod" ? "var(--primary-color)" : "var(--card-border)"
                    }}
                  >
                    <div>
                      <input 
                        type="radio" 
                        name="payment" 
                        id="payCod" 
                        checked={paymentMethod === "cod"} 
                        onChange={() => setPaymentMethod("cod")}
                        className="form-check-input me-3"
                      />
                      <label htmlFor="payCod" className="pointer fw-bold small m-0">Cash on Delivery (COD)</label>
                    </div>
                    <i className="bi-cash fs-4 text-muted"></i>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-3 rounded-3 border pointer d-flex align-items-center justify-content-between`}
                    style={{ 
                      background: theme === "light" ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.02)",
                      borderColor: paymentMethod === "upi" ? "var(--primary-color)" : "var(--card-border)"
                    }}
                  >
                    <div>
                      <input 
                        type="radio" 
                        name="payment" 
                        id="payUpi" 
                        checked={paymentMethod === "upi"} 
                        onChange={() => setPaymentMethod("upi")}
                        className="form-check-input me-3"
                      />
                      <label htmlFor="payUpi" className="pointer fw-bold small m-0">UPI Instant Transfer</label>
                    </div>
                    <i className="bi-qr-code-scan fs-4 text-muted"></i>
                  </div>

                  {paymentMethod === "upi" && (
                    <div className="p-3 rounded-3 border-top-0 border border-secondary border-opacity-15 bg-dark bg-opacity-10 mt-n2">
                      <label className="form-label text-muted extra-small fw-bold">ENTER UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        className="form-control form-control-sm"
                        placeholder="username@bankid"
                        value={paymentDetails.upiId}
                        onChange={handlePaymentDetailsChange}
                      />
                    </div>
                  )}

                  <div 
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-3 border pointer d-flex align-items-center justify-content-between`}
                    style={{ 
                      background: theme === "light" ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.02)",
                      borderColor: paymentMethod === "card" ? "var(--primary-color)" : "var(--card-border)"
                    }}
                  >
                    <div>
                      <input 
                        type="radio" 
                        name="payment" 
                        id="payCard" 
                        checked={paymentMethod === "card"} 
                        onChange={() => setPaymentMethod("card")}
                        className="form-check-input me-3"
                      />
                      <label htmlFor="payCard" className="pointer fw-bold small m-0">Credit / Debit Card</label>
                    </div>
                    <i className="bi-credit-card-2-back fs-4 text-muted"></i>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="p-3 rounded-3 border-top-0 border border-secondary border-opacity-15 bg-dark bg-opacity-10 mt-n2">
                      <div className="mb-2">
                        <label className="form-label text-muted extra-small fw-bold">CARD NUMBER</label>
                        <input
                          type="text"
                          name="cardNumber"
                          className="form-control form-control-sm"
                          placeholder="0000 0000 0000 0000"
                          value={paymentDetails.cardNumber}
                          onChange={handlePaymentDetailsChange}
                        />
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label className="form-label text-muted extra-small fw-bold">EXPIRY DATE</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            className="form-control form-control-sm"
                            placeholder="MM/YY"
                            value={paymentDetails.cardExpiry}
                            onChange={handlePaymentDetailsChange}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label text-muted extra-small fw-bold">CVV CODE</label>
                          <input
                            type="password"
                            name="cardCvv"
                            className="form-control form-control-sm"
                            placeholder="***"
                            maxLength="3"
                            value={paymentDetails.cardCvv}
                            onChange={handlePaymentDetailsChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gradient w-100 py-3 rounded-pill d-flex align-items-center justify-content-center fw-bold text-white mt-4"
                disabled={cart.length === 0}
              >
                <i className="bi-lock-fill me-2"></i> Authorize & Place Order ({formatCurrency(grandTotal)})
              </button>
            </form>
          </div>
        </div>

        {/* Order review side right */}
        <div className="col-12 col-lg-5">
          <div 
            className="p-4 rounded-4 shadow-sm border"
            style={{ 
              background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.4)", 
              borderColor: "var(--card-border)" 
            }}
          >
            <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ borderColor: "var(--card-border)" }}>Review Items</h5>
            
            <div className="d-flex flex-column gap-3 max-h-300 overflow-y-auto mb-3 pe-2" style={{ maxHeight: "280px" }}>
              {cart.map((item) => (
                <div key={item.product._id} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--card-border)" }}>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product.name}
                      className="rounded-2"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
                      }}
                    />
                    <div>
                      <div className="text-white small fw-bold text-truncate" style={{ maxWidth: "150px", color: "var(--text-main) !important" }}>{item.product.name}</div>
                      <div className="text-muted extra-small">{item.quantity} x {formatCurrency(item.product.price)}</div>
                    </div>
                  </div>
                  <div className="fw-bold small">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top pt-3 mt-3" style={{ borderColor: "var(--card-border)" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Subtotal:</span>
                <span className="small fw-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {coupon.code && (
                <div className="d-flex justify-content-between align-items-center mb-2 text-success">
                  <span className="small">Coupon Discount ({coupon.code}):</span>
                  <span className="small fw-bold">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">GST (18%):</span>
                <span className="small fw-semibold">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small">Delivery Charges:</span>
                <span className={shippingFee === 0 ? "text-success small fw-bold" : "small fw-semibold"}>
                  {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3" style={{ borderColor: "var(--card-border)" }}>
                <span className="fw-bold">Payable Balance:</span>
                <span className="text-primary fw-extrabold fs-5">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
