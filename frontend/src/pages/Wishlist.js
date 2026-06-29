import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import API from "../services/api";
import { getProductImage, formatCurrency } from "../services/utils";

const Wishlist = () => {
  const { toggleWishlist, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users/wishlist");
      setWishlistItems(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?.wishlist]); // refetch when user's wishlist ID array changes

  const handleRemove = async (productId) => {
    const res = await toggleWishlist(productId);
    if (res.success) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      showToast("Item removed from wishlist");
    } else {
      showToast(res.message || "Failed to remove item");
    }
  };

  const handleMoveToCart = async (product) => {
    // Add to cart
    addToCart(product, 1);
    // Remove from wishlist
    const res = await toggleWishlist(product._id);
    if (res.success) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
      showToast("Moved item to cart!");
    } else {
      showToast("Added to cart, but failed to remove from wishlist.");
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Retrieving your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
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
          <h2 className="fw-bold m-0">My Wishlist</h2>
          <p className="text-muted m-0">Saved products you love ({wishlistItems.length})</p>
        </div>
        <Link to="/shop" className="btn btn-outline-primary rounded-pill">
          <i className="bi-arrow-left me-2"></i>Continue Shopping
        </Link>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {wishlistItems.length === 0 ? (
        <div 
          className="text-center py-5 rounded-4 border border-dashed"
          style={{ 
            borderColor: theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
            background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)" 
          }}
        >
          <div className="display-4 text-muted mb-3">
            <i className="bi-heartbreak"></i>
          </div>
          <h4 className="fw-semibold">Your wishlist is empty</h4>
          <p className="text-muted max-w-600 mx-auto px-3">
            Tap the heart icon on any product to save it to your wishlist. You can view, share, or buy them anytime!
          </p>
          <Link to="/shop" className="btn btn-gradient rounded-pill px-4 mt-2">
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((product) => {
            const finalPrice = product.price;
            const originalPrice = product.discount > 0 ? Math.round(product.price / (1 - product.discount / 100)) : null;

            return (
              <div key={product._id} className="col-12 col-md-4 col-lg-3">
                <div 
                  className="card h-100 border-0 overflow-hidden shadow-sm"
                  style={{
                    background: theme === "light" ? "rgba(255,255,255,0.8)" : "rgba(30,41,59,0.5)",
                    border: theme === "light" ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Badge & Trash button */}
                  <div className="position-absolute top-0 end-0 p-2 d-flex justify-content-between w-100 align-items-center" style={{ zIndex: 2 }}>
                    <div>
                      {product.discount > 0 && (
                        <span className="badge bg-danger rounded-pill px-2 py-1 small">
                          -{product.discount}% OFF
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemove(product._id)}
                      className="btn btn-dark btn-sm rounded-circle d-flex align-items-center justify-content-center border-0"
                      style={{ width: "32px", height: "32px", background: "rgba(15,23,42,0.85)" }}
                      title="Remove from wishlist"
                    >
                      <i className="bi-trash text-danger"></i>
                    </button>
                  </div>

                  {/* Image */}
                  <div style={{ height: "200px", overflow: "hidden", background: "#f8fafc" }} className="position-relative">
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      className="w-100 h-100 object-fit-contain p-3" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
                      }}
                    />
                  </div>

                  {/* Body */}
                  <div className="card-body d-flex flex-column justify-content-between p-3">
                    <div>
                      <span className="text-primary extra-small fw-bold text-uppercase">{product.brand || "Aura"}</span>
                      <h6 className="card-title fw-bold text-truncate m-0 mt-1">
                        <Link to={`/product/${product._id}`} className="text-decoration-none text-reset">
                          {product.name}
                        </Link>
                      </h6>
                      
                      {/* Price section */}
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <span className="fs-5 fw-bold text-primary">{formatCurrency(finalPrice)}</span>
                        {originalPrice && (
                          <span className="text-decoration-line-through text-muted small">{formatCurrency(originalPrice)}</span>
                        )}
                      </div>

                      {/* Stock indicator */}
                      <div className="mt-2">
                        {product.stock > 0 ? (
                          <span className="extra-small text-success d-flex align-items-center gap-1">
                            <i className="bi-check-circle-fill"></i> In Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="extra-small text-danger d-flex align-items-center gap-1">
                            <i className="bi-x-circle-fill"></i> Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <button 
                        onClick={() => handleMoveToCart(product)}
                        disabled={product.stock <= 0}
                        className="btn btn-gradient w-100 rounded-pill py-2 text-white fw-semibold small d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="bi-cart-plus"></i> Move to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
