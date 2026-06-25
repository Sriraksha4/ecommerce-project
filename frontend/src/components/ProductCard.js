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
    <div className="card h-100 border-0 stat-card fade-in overflow-hidden d-flex flex-column" style={{ background: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      {/* Product Image */}
      <div className="position-relative overflow-hidden" style={{ height: "200px", background: "rgba(0,0,0,0.15)" }}>
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="w-100 h-100 object-fit-cover"
          style={{ transition: "transform 0.5s ease" }}
          onError={(e) => {
            e.target.src = getProductImage(product);
          }}
        />
        <span className="position-absolute top-3 start-3 badge bg-dark bg-opacity-75 text-primary border border-primary border-opacity-25 px-3 py-2 m-3 rounded-pill extra-small fw-semibold" style={{ fontSize: "0.75rem" }}>
          {product.category}
        </span>
        {product.stock <= 0 && (
          <span className="position-absolute top-50 start-50 translate-middle badge bg-danger px-4 py-2 fs-6 shadow">
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Body */}
      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <h5 className="card-title text-white fw-bold mb-1 text-truncate" title={product.name}>
          {product.name}
        </h5>
        <p className="card-text text-muted small flex-grow-1 mb-3" style={{ display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>
          {product.description || "No description available for this item."}
        </p>

        <div className="d-flex align-items-center justify-content-between mb-4 mt-auto">
          <span className="text-muted extra-small" style={{ fontSize: "0.75rem" }}>PRICE</span>
          <span className="text-white fw-extrabold fs-4">₹{product.price.toLocaleString("en-IN")}</span>
        </div>

        <div className="d-flex gap-2">
          {/* View Details */}
          <Link
            to={`/product/${product._id}`}
            className="btn btn-gradient-secondary flex-grow-1 text-center py-2 btn-sm rounded-3 d-flex align-items-center justify-content-center"
          >
            Details
          </Link>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`btn btn-sm rounded-3 py-2 flex-grow-1 d-flex align-items-center justify-content-center ${added ? "btn-success" : "btn-gradient"}`}
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
