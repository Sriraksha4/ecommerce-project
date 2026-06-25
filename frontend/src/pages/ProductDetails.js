import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { getProductImage } from "../services/utils";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
        setMainImageIndex(0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Product not found or has been removed from catalog.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const fetchSimilar = async () => {
      try {
        const response = await API.get("/products");
        const filtered = (response.data || [])
          .filter((p) => p._id !== product._id && p.category === product.category)
          .slice(0, 4);
        setSimilarProducts(filtered);
      } catch (err) {
        console.error("Failed to load similar products", err);
      }
    };
    fetchSimilar();
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setWishlistLoading(true);
    await toggleWishlist(product._id);
    setWishlistLoading(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center fade-in">
        <div className="table-container p-5 text-center text-muted max-w-600 mx-auto rounded-4">
          <i className="bi-exclamation-octagon fs-1 text-danger mb-2"></i>
          <h4 className="text-white fw-bold">Item Unreachable</h4>
          <p className="small mb-4">{error || "Product not found."}</p>
          <Link to="/shop" className="btn btn-gradient btn-sm px-4 rounded-pill">Back To Shop</Link>
        </div>
      </div>
    );
  }

  // Compile image list
  const allImages = product.images && product.images.length > 0
    ? product.images
    : [getProductImage(product)];

  const isWishlisted = user?.wishlist?.includes(product._id);
  const finalPrice = product.price;
  const originalPrice = product.discount > 0 ? Math.round(product.price / (1 - product.discount / 100)) : null;

  return (
    <div className="container py-4 fade-in">
      {/* Back Link */}
      <div className="mb-4">
        <Link to="/shop" className="text-muted text-decoration-none small hover-text-white fw-semibold">
          <i className="bi-arrow-left me-1"></i> Back to Catalog
        </Link>
      </div>

      <div className="row g-5">
        {/* Product Image Panel (Left) */}
        <div className="col-12 col-md-6">
          {/* Main magnifying zoom container */}
          <div 
            className="position-relative overflow-hidden rounded-4 border d-flex align-items-center justify-content-center"
            style={{ 
              height: "400px", 
              background: "#fff",
              cursor: "zoom-in",
              borderColor: "var(--card-border)"
            }}
          >
            <img
              src={allImages[mainImageIndex]}
              alt={product.name}
              className="h-100 object-fit-contain p-3"
              style={{ 
                transition: "transform 0.1s ease",
              }}
              onMouseMove={(e) => {
                const { left, top, width, height } = e.target.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                e.target.style.transformOrigin = `${x}% ${y}%`;
                e.target.style.transform = "scale(1.8)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.transformOrigin = "center center";
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
              }}
            />
          </div>

          {/* Thumbnail selector */}
          {allImages.length > 1 && (
            <div className="d-flex gap-2 mt-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setMainImageIndex(index)}
                  className={`btn p-0 border-2 rounded-3 overflow-hidden ${mainImageIndex === index ? "border-primary" : "border-transparent"}`}
                  style={{ width: "60px", height: "60px", background: "#f8fafc" }}
                >
                  <img 
                    src={imgUrl} 
                    alt="Thumbnail" 
                    className="w-100 h-100 object-fit-contain p-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Panel (Right) */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column h-100 justify-content-start">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-semibold" style={{ fontSize: "0.8rem" }}>
                {product.category}
              </span>
              <button 
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="btn btn-dark rounded-circle p-2 border-0 d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px", background: theme === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? (
                  <i className="bi-heart-fill text-danger fs-5"></i>
                ) : (
                  <i className="bi-heart text-danger fs-5"></i>
                )}
              </button>
            </div>
            
            <h2 className="fw-extrabold mb-1">{product.name}</h2>
            <div className="small text-muted mb-3">Brand: <strong className="text-primary">{product.brand || "Aura"}</strong></div>

            {/* Ratings Summary */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="text-warning small">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <i key={idx} className={`bi-star${idx < Math.round(product.rating || 0) ? "-fill" : ""}`}></i>
                ))}
              </div>
              <span className="small text-muted fw-bold">{(product.rating || 0).toFixed(1)} Rating</span>
              <span className="text-secondary">|</span>
              <span className="small text-muted">{product.reviews?.length || 0} Reviews</span>
            </div>

            {/* Pricing Section */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="h2 text-primary fw-extrabold m-0">${finalPrice}</span>
              {originalPrice && (
                <>
                  <span className="text-decoration-line-through text-muted fs-5 m-0">${originalPrice}</span>
                  <span className="badge bg-danger rounded-pill px-3 py-1 font-bold">-{product.discount}% OFF</span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <h6 className="text-muted small fw-bold mb-2">DESCRIPTION</h6>
              <p className="text-muted small lh-lg m-0">{product.description || "No description provided for this catalog item."}</p>
            </div>

            {/* Availability */}
            <div className="mb-4 d-flex align-items-center gap-3">
              <h6 className="text-muted small fw-bold m-0">STOCK STATUS:</h6>
              <span className={`badge-status badge-${product.stock === 0 ? "cancelled" : product.stock <= 5 ? "pending" : "delivered"}`}>
                {product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? `Low Stock (${product.stock} left)` : "In Stock"}
              </span>
            </div>

            {/* Actions */}
            {product.stock > 0 ? (
              <div className="row g-3 align-items-center mb-4">
                <div className="col-4 col-sm-3">
                  <label className="form-label text-muted small fw-bold mb-1">QUANTITY</label>
                  <input
                    type="number"
                    className="form-control form-control-custom text-center py-2"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  />
                </div>
                <div className="col-8 col-sm-9 d-flex gap-2 align-items-end h-100 pt-4">
                  <button
                    onClick={handleAddToCart}
                    className={`btn btn-gradient py-2 rounded-pill px-3 flex-grow-1 text-white fw-bold small`}
                  >
                    {added ? <><i className="bi-check-lg me-2"></i> Added</> : <><i className="bi-cart-plus-fill me-2"></i> Add to Cart</>}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="btn btn-outline-primary py-2 rounded-pill px-3 flex-grow-1 fw-bold small"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="alert alert-danger py-2 px-3 rounded-3 small fw-bold mb-4">
                <i className="bi-exclamation-circle-fill me-2"></i> This product is currently sold out and unavailable.
              </div>
            )}

            {/* Back Button */}
            <div className="mt-auto border-top border-secondary border-opacity-10 pt-4">
              <div className="d-flex align-items-center gap-3">
                <i className="bi-shield-check text-muted fs-4"></i>
                <div className="small text-muted">
                  <strong className="text-white">Aura Trust Guarantee</strong>
                  <br />
                  100% genuine products with secure delivery and easy exchanges.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications / Review Tabs */}
      <div className="mt-5 border-top border-secondary border-opacity-15 pt-5">
        <ul className="nav nav-tabs border-secondary border-opacity-20 mb-4" id="detailTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active fw-bold text-reset border-0 border-bottom border-primary py-3 px-4" id="reviews-tab" data-bs-toggle="tab" data-bs-target="#reviews" type="button" role="tab" aria-controls="reviews" aria-selected="true">
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </li>
        </ul>
        <div className="tab-content" id="detailTabsContent">
          <div className="tab-pane fade show active" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="p-4 text-center text-muted rounded-4 bg-dark bg-opacity-10 border border-dashed border-secondary border-opacity-10">
                <i className="bi-chat-left-text fs-2 text-primary mb-2 d-block"></i>
                <p className="small m-0 fw-semibold">No reviews yet for this product. Be the first to leave feedback!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className="p-3 rounded-4 border" style={{ background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)", borderColor: "var(--card-border)" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold m-0 small">{rev.name || "Anonymous User"}</h6>
                      <span className="extra-small text-muted">{new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div className="text-warning mb-2 extra-small">
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <i key={sIdx} className={`bi-star${sIdx < Math.round(rev.rating || 5) ? "-fill" : ""}`}></i>
                      ))}
                    </div>
                    <p className="text-muted small m-0 lh-base">{rev.comment || "Great product, highly satisfied!"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products Carousel */}
      {similarProducts.length > 0 && (
        <div className="mt-5 border-top border-secondary border-opacity-15 pt-5">
          <h4 className="fw-bold mb-4">Similar Products</h4>
          <div className="row g-4">
            {similarProducts.map((p) => (
              <div key={p._id} className="col-12 col-sm-6 col-md-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
