import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import { ThemeContext } from "../context/ThemeContext";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
        ]);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unable to load store collection. Make sure the backend server is running.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Split products into distinct sections for visual variety
  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.slice().reverse().slice(0, 4);
  const bestSellers = products.slice(1, 5);

  return (
    <div className="container py-4 fade-in">
      {/* Hero Banner */}
      <HeroSection />

      {/* Categories Horizontal Panel */}
      <div className="mb-5">
        <h4 className="fw-bold mb-3 d-flex align-items-center">
          <i className="bi-grid-fill text-primary me-2"></i> Browse Categories
        </h4>
        {categories.length === 0 ? (
          <p className="text-muted small">No categories configured yet.</p>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`btn border border-secondary border-opacity-10 px-4 py-2 rounded-pill small hover-border-primary`}
                style={{ 
                  background: theme === "light" ? "rgba(0, 0, 0, 0.05)" : "rgba(30, 41, 59, 0.4)", 
                  color: "var(--text-main)", 
                  transition: "all 0.2s ease" 
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning rounded-3 p-3 mb-4 d-flex align-items-center">
          <i className="bi-exclamation-triangle-fill me-2 fs-5"></i>
          <span className="small fw-semibold">{error}</span>
        </div>
      )}

      {/* Featured Products Grid */}
      <div id="featured" className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold m-0">Featured Products</h4>
            <p className="text-muted small mb-0 font-light">Handpicked premium designs</p>
          </div>
          <Link to="/shop" className="btn btn-outline-primary btn-sm rounded-pill px-4">
            View All <i className="bi-arrow-right-short"></i>
          </Link>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="p-5 text-center text-muted rounded-4" style={{ background: "rgba(255,255,255,0.02)" }}>
            <i className="bi-shop fs-1 mb-2"></i>
            <p className="mb-0">No products available in the shop catalogue yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Discount Cards / Offers */}
      <div className="mb-5">
        <h4 className="fw-bold mb-4 d-flex align-items-center">
          <i className="bi-percent text-danger me-2"></i> Exclusive Offers
        </h4>
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4 shadow-sm border-0 d-flex justify-content-between align-items-center position-relative overflow-hidden" 
                 style={{ 
                   background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                   color: "white",
                   minHeight: "180px"
                 }}>
              <div style={{ zIndex: 1 }}>
                <span className="badge bg-danger rounded-pill mb-2">LIMITED TIME OFFER</span>
                <h4 className="fw-bold m-0">Up to 40% Off Tech Gears</h4>
                <p className="text-white-50 small mt-1">Upgrade your workspace with premium electronics.</p>
                <Link to="/shop?category=Electronics" className="btn btn-light btn-sm rounded-pill px-4 mt-2 fw-bold">
                  Shop Deals
                </Link>
              </div>
              <i className="bi-laptop position-absolute" style={{ fontSize: "120px", right: "-10px", bottom: "-30px", opacity: 0.15 }}></i>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="p-4 rounded-4 shadow-sm border-0 d-flex justify-content-between align-items-center position-relative overflow-hidden" 
                 style={{ 
                   background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
                   color: "white",
                   minHeight: "180px"
                 }}>
              <div style={{ zIndex: 1 }}>
                <span className="badge bg-warning text-dark rounded-pill mb-2">SEASON SALE</span>
                <h4 className="fw-bold m-0">Fashion Accessories - Flat 25% Off</h4>
                <p className="text-white-50 small mt-1">Accessorize your style with curated items.</p>
                <Link to="/shop?category=Clothing" className="btn btn-light btn-sm rounded-pill px-4 mt-2 fw-bold">
                  View Collection
                </Link>
              </div>
              <i className="bi-smartwatch position-absolute" style={{ fontSize: "120px", right: "-10px", bottom: "-30px", opacity: 0.15 }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Products Grid */}
      {!loading && trendingProducts.length > 0 && (
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold m-0">Trending Now</h4>
              <p className="text-muted small mb-0 font-light">Hot collections flying off shelves</p>
            </div>
            <Link to="/shop" className="btn btn-outline-primary btn-sm rounded-pill px-4">
              View All <i className="bi-arrow-right-short"></i>
            </Link>
          </div>
          <div className="row g-4">
            {trendingProducts.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Sellers Grid */}
      {!loading && bestSellers.length > 0 && (
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold m-0">Best Sellers</h4>
              <p className="text-muted small mb-0 font-light">Highest rated products by our customers</p>
            </div>
            <Link to="/shop" className="btn btn-outline-primary btn-sm rounded-pill px-4">
              View All <i className="bi-arrow-right-short"></i>
            </Link>
          </div>
          <div className="row g-4">
            {bestSellers.map((product) => (
              <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      <div className="mb-5 py-4">
        <h4 className="fw-bold mb-4 text-center">What Our Customers Say</h4>
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 p-4 shadow-sm" style={{ background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
              <div className="d-flex align-items-center gap-1 text-warning mb-3">
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
              </div>
              <p className="text-muted small mb-3">"Exceptional quality products and lightning-fast delivery! AuraCommerce has completely redefined my online shopping experience. Strongly recommended."</p>
              <div className="d-flex align-items-center gap-2 mt-auto">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px" }}>S</div>
                <div>
                  <h6 className="fw-bold m-0 small">Sarah Jenkins</h6>
                  <span className="text-muted extra-small">Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 p-4 shadow-sm" style={{ background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
              <div className="d-flex align-items-center gap-1 text-warning mb-3">
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
              </div>
              <p className="text-muted small mb-3">"The customer support team resolved my exchange query in minutes. The products are authentic, matching description exactly. Great experience!"</p>
              <div className="d-flex align-items-center gap-2 mt-auto">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px" }}>M</div>
                <div>
                  <h6 className="fw-bold m-0 small">Marcus Aurelius</h6>
                  <span className="text-muted extra-small">Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card h-100 border-0 p-4 shadow-sm" style={{ background: theme === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
              <div className="d-flex align-items-center gap-1 text-warning mb-3">
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
                <i className="bi-star-fill"></i>
              </div>
              <p className="text-muted small mb-3">"I am in love with the dark theme layout and premium aesthetics. Browsing and checkout are smooth as butter. A premium brand indeed."</p>
              <div className="d-flex align-items-center gap-2 mt-auto">
                <div className="bg-purple text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "36px", height: "36px" }}>E</div>
                <div>
                  <h6 className="fw-bold m-0 small">Elena Rostova</h6>
                  <span className="text-muted extra-small">Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="p-4 p-md-5 rounded-4 shadow-sm text-center mb-5 mt-5"
           style={{ 
             background: theme === "light" ? "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)" : "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
             border: theme === "light" ? "1px solid rgba(14, 165, 233, 0.1)" : "1px solid rgba(255,255,255,0.04)"
           }}>
        <h3 className="fw-bold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-muted small max-w-600 mx-auto mb-4">
          Stay up to date with new arrivals, exclusive discount coupons, and community announcements! No spam, unsubscribe anytime.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="d-flex flex-column flex-sm-row gap-2 max-w-600 mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            required 
            className="form-control rounded-pill px-4" 
            style={{ 
              background: theme === "light" ? "#fff" : "rgba(30,41,59,0.7)", 
              border: "1px solid rgba(59,130,246,0.2)",
              color: theme === "light" ? "#000" : "#fff" 
            }}
          />
          <button type="submit" className="btn btn-primary rounded-pill px-4 fw-semibold text-nowrap">
            Join Waitlist
          </button>
        </form>
      </div>

      {/* Benefits / Showcase Banner */}
      <div className="row g-4 mb-4 mt-5">
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4 h-100" style={{ background: "rgba(30, 41, 59, 0.25)", border: "1px solid var(--card-border)" }}>
            <div className="fs-3 text-primary mb-2"><i className="bi-truck"></i></div>
            <h6 className="fw-bold mb-1">Secure Delivery</h6>
            <p className="text-muted small mb-0 lh-base">Safe and tracked logistics directly from our warehouses to your doorstep.</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4 h-100" style={{ background: "rgba(30, 41, 59, 0.25)", border: "1px solid var(--card-border)" }}>
            <div className="fs-3 text-primary mb-2"><i className="bi-arrow-left-right"></i></div>
            <h6 className="fw-bold mb-1">Easy Exchanges</h6>
            <p className="text-muted small mb-0 lh-base">Hassle-free 7-day exchange window if items do not match descriptions.</p>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="p-4 rounded-4 h-100" style={{ background: "rgba(30, 41, 59, 0.25)", border: "1px solid var(--card-border)" }}>
            <div className="fs-3 text-primary mb-2"><i className="bi-credit-card-2-front"></i></div>
            <h6 className="fw-bold mb-1">Safe Checkout</h6>
            <p className="text-muted small mb-0 lh-base">Encrypted transaction records keeping user orders data private.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;