import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getProductImage } from "../services/utils";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="product-card-shell fade-in d-flex flex-column">
      {/* Product Image */}
      <div className="product-card-image position-relative" style={{ height: "240px" }}>
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.src = getProductImage(product);
          }}
        />
        <span className="position-absolute top-0 start-0 badge badge-status m-3" style={{ background: "rgba(255,255,255,0.82)", color: "var(--text-main)", backdropFilter: "blur(12px)" }}>
          {product.category}
        </span>
        {product.stock <= 0 && (
          <span className="position-absolute top-50 start-50 translate-middle badge bg-danger px-4 py-2 fs-6 shadow rounded-pill">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Body */}
      <div className="product-card-body d-flex flex-column flex-grow-1">
        <h5 className="product-card-title mb-2 text-truncate" title={product.name}>
          {product.name}
        </h5>
        <p className="small flex-grow-1 mb-3" style={{ color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.6" }}>
          {product.description || "No description available for this item."}
        </p>

        <div className="d-flex align-items-center justify-content-between mb-4 mt-auto">
          <span className="text-uppercase extra-small" style={{ color: "var(--text-soft)", letterSpacing: "0.14em" }}>Price</span>
          <span className="fw-semibold fs-4" style={{ color: "var(--text-main)" }}>₹{product.price.toLocaleString("en-IN")}</span>
        </div>

        <div className="d-flex gap-2">
          {/* View Details */}
          <Link
            to={`/product/${product._id}`}
            className="btn btn-gradient-secondary flex-grow-1 text-center py-2 btn-sm rounded-pill d-flex align-items-center justify-content-center"
          >
            Details
          </Link>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`btn btn-sm rounded-pill py-2 flex-grow-1 d-flex align-items-center justify-content-center ${added ? "btn-success" : "btn-gradient"}`}
            disabled={product.stock <= 0}
          >
            {added ? (
              <>
                <i className="bi-check-lg me-1"></i> Added
              </>
            ) : (
              <>
                <i className="bi-cart-plus me-1"></i> Add Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
