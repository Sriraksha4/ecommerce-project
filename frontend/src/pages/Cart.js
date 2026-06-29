import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { getProductImage, formatCurrency } from "../services/utils";

const Cart = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    coupon, 
    applyCoupon, 
    removeCoupon, 
    discountAmount, 
    gstAmount, 
    shippingFee, 
    grandTotal 
  } = useContext(CartContext);
  
  const { theme } = useContext(ThemeContext);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState({ error: false, message: "" });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponFeedback({ error: false, message: res.message });
      setCouponCodeInput("");
    } else {
      setCouponFeedback({ error: true, message: res.message });
    }
    setTimeout(() => setCouponFeedback({ error: false, message: "" }), 3000);
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center fade-in">
        <div 
          className="p-5 text-center text-muted max-w-600 mx-auto rounded-4 border"
          style={{ 
            background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
            borderColor: "var(--card-border)"
          }}
        >
          <i className="bi-cart-x fs-1 text-primary mb-2"></i>
          <h4 className="fw-bold">Your Basket is Empty</h4>
          <p className="small mb-4 text-muted">You haven't added any products to your shopping cart yet.</p>
          <Link to="/shop" className="btn btn-gradient btn-sm px-4 rounded-pill">Browse Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      <h3 className="fw-bold mb-4">Shopping Cart ({cart.reduce((tot, i) => tot + i.quantity, 0)} items)</h3>

      <div className="row g-4">
        {/* Cart items list side */}
        <div className="col-12 col-xl-8">
          <div 
            className="table-container"
            style={{ 
              background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.35)", 
              border: "1px solid var(--card-border)", 
              borderRadius: "16px" 
            }}
          >
            <div className="table-responsive">
              <table className="table table-custom align-middle">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <th style={{ width: "80px" }}>PRODUCT</th>
                    <th>NAME</th>
                    <th>UNIT PRICE</th>
                    <th style={{ width: "120px" }}>QUANTITY</th>
                    <th>SUBTOTAL</th>
                    <th className="text-center" style={{ width: "60px" }}>REMOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.product._id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                      <td>
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          className="rounded-3"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
                          }}
                        />
                      </td>
                      <td>
                        <Link to={`/product/${item.product._id}`} className="fw-bold text-decoration-none text-reset hover-text-primary">
                          {item.product.name}
                        </Link>
                        <div className="text-muted extra-small" style={{ fontSize: "0.75rem" }}>{item.product.category}</div>
                      </td>
                      <td>{formatCurrency(item.product.price)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className={`btn ${theme === "light" ? "btn-light border" : "btn-dark"} btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center`}
                            style={{ width: "24px", height: "24px" }}
                          >
                            <i className="bi-minus text-muted"></i>
                          </button>
                          <span className="fw-bold px-2 text-center" style={{ minWidth: "25px", fontSize: "0.85rem" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className={`btn ${theme === "light" ? "btn-light border" : "btn-dark"} btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center`}
                            style={{ width: "24px", height: "24px" }}
                          >
                            <i className="bi-plus text-muted"></i>
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold">{formatCurrency(item.product.price * item.quantity)}</td>
                      <td className="text-center">
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="btn btn-link text-danger p-0"
                          title="Remove item"
                        >
                          <i className="bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Totals Summary Side */}
        <div className="col-12 col-xl-4">
          {/* Coupon Code Section */}
          <div 
            className="p-4 rounded-4 mb-3 border shadow-sm"
            style={{ 
              background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.4)", 
              borderColor: "var(--card-border)" 
            }}
          >
            <h6 className="fw-bold mb-3">Apply Coupon Code</h6>
            {coupon.code ? (
              <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-success small">Coupon {coupon.code} Applied!</div>
                  <div className="text-muted extra-small">{coupon.discountPercent}% off on cart products</div>
                </div>
                <button onClick={removeCoupon} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. DISCOUNT10, AURA20"
                  className="form-control rounded-pill px-3"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  style={{ background: theme === "light" ? "#fff" : "rgba(15,23,42,0.6)", color: "var(--text-main)" }}
                />
                <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold text-nowrap">
                  Apply
                </button>
              </form>
            )}
            {couponFeedback.message && (
              <div className={`mt-2 small fw-bold ${couponFeedback.error ? "text-danger" : "text-success"}`}>
                {couponFeedback.message}
              </div>
            )}
          </div>

          {/* Checkout Totals Summary */}
          <div 
            className="p-4 rounded-4 border shadow-sm"
            style={{ 
              background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30, 41, 59, 0.4)", 
              borderColor: "var(--card-border)" 
            }}
          >
            <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ borderColor: "var(--card-border)" }}>Order Summary</h5>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Subtotal:</span>
              <span className="fw-semibold">{formatCurrency(subtotal)}</span>
            </div>

            {coupon.code && (
              <div className="d-flex justify-content-between align-items-center mb-3 text-success">
                <span className="small">Coupon Discount ({coupon.code}):</span>
                <span className="fw-bold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">GST (18%):</span>
              <span className="fw-semibold">{formatCurrency(gstAmount)}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Shipping Charges:</span>
              <span className={shippingFee === 0 ? "text-success small fw-bold" : "fw-semibold"}>
                {shippingFee === 0 ? "FREE Delivery" : formatCurrency(shippingFee)}
              </span>
            </div>

            <hr style={{ borderColor: "var(--card-border)" }} />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold">Total Amount:</span>
              <span className="text-primary fw-extrabold fs-4">{formatCurrency(grandTotal)}</span>
            </div>

            <Link to="/checkout" className="btn btn-gradient w-100 py-3 rounded-pill d-flex align-items-center justify-content-center fw-bold text-white">
              <i className="bi-credit-card-fill me-2"></i> Proceed to Checkout
            </Link>

            <Link to="/shop" className="btn btn-gradient-secondary w-100 py-2 rounded-pill text-center mt-2 small fw-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
