import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { ThemeContext } from "../context/ThemeContext";
import { formatCurrency } from "../services/utils";

const Shop = () => {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sync category query param from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catQuery = params.get("category");
    if (catQuery) {
      setSelectedCategory(catQuery);
    }
  }, [location]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
        ]);
        const fetchedProducts = productsRes.data || [];
        setProducts(fetchedProducts);
        setCategories(categoriesRes.data || []);
        
        // Dynamically set max price
        if (fetchedProducts.length > 0) {
          const highestPrice = Math.max(...fetchedProducts.map((p) => p.price));
          setMaxPrice(highestPrice || 2000);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load catalog. Please check your network connection.");
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setMinRating(0);
    setInStockOnly(false);
    setSearch("");
    if (products.length > 0) {
      const highestPrice = Math.max(...products.map((p) => p.price));
      setMaxPrice(highestPrice);
    }
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Compile list of brands dynamically from products
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  // Suggestions search list
  const suggestions = search.trim().length > 1
    ? products
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
    : [];

  // Filtering application
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
      
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesBrand = selectedBrand ? p.brand === selectedBrand : true;
    const matchesPrice = p.price <= maxPrice;
    const matchesRating = (p.rating || 0) >= minRating;
    const matchesStock = inStockOnly ? p.stock > 0 : true;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock;
  });

  // Sorting application
  const handleSort = (items) => {
    const sorted = [...items];
    if (sortBy === "price-low-high") {
      return sorted.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-high-low") {
      return sorted.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "highest-rated") {
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    // newest sort
    return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const sortedProducts = handleSort(filteredProducts);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container py-4 fade-in">
      <div className="row g-4">
        {/* Left Side: Sidebar Filters */}
        <div className="col-12 col-lg-3">
          <div 
            className="p-4 rounded-4 shadow-sm luxury-card filter-panel" 
            style={{ 
              background: theme === "light" ? "rgba(255,255,255,0.82)" : "rgba(17,17,17,0.36)", 
              border: theme === "light" ? "1px solid rgba(17,17,17,0.08)" : "1px solid rgba(255,255,255,0.08)" 
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0">Filters</h5>
              <button 
                onClick={handleClearFilters}
                className="btn btn-link text-primary small p-0 text-decoration-none fw-bold"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter list */}
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold mb-2">CATEGORY</label>
              <select 
                className="form-select filter-select rounded-4 py-2 small"
                value={selectedCategory}
                onChange={(e) => handleCategorySelect(e.target.value)}
                style={{ background: theme === "light" ? "#fff" : "rgba(17,17,17,0.72)", color: "var(--text-main)" }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter list */}
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold mb-2">BRAND</label>
              <select 
                className="form-select filter-select rounded-4 py-2 small"
                value={selectedBrand}
                onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
                style={{ background: theme === "light" ? "#fff" : "rgba(17,17,17,0.72)", color: "var(--text-main)" }}
              >
                <option value="">All Brands</option>
                {brands.map((b, idx) => (
                  <option key={idx} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Filter slider */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label text-muted small fw-bold m-0">PRICE LIMIT</label>
                <span className="text-primary fw-bold small">{formatCurrency(maxPrice)}</span>
              </div>
              <input 
                type="range" 
                className="form-range" 
                min="0" 
                max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 2000} 
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
              />
            </div>

            {/* Rating Filter buttons */}
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold mb-2">MIN RATING</label>
              <div className="d-flex flex-wrap gap-2">
                {[0, 3, 4, 4.5].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => { setMinRating(ratingVal); setCurrentPage(1); }}
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${minRating === ratingVal ? "btn-primary text-white" : "btn-outline-secondary"}`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {ratingVal === 0 ? "All" : `${ratingVal}★ & Up`}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability toggle */}
            <div className="form-check form-switch mt-3">
              <input 
                className="form-check-input pointer" 
                type="checkbox" 
                role="switch" 
                id="stockSwitch"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
              />
              <label className="form-check-label pointer text-muted small fw-bold" htmlFor="stockSwitch">
                IN STOCK ONLY
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Products Catalog Grid */}
        <div className="col-12 col-lg-9">
          {/* Search bar with Autocomplete */}
          <div className="mb-4 position-relative">
            <div className="position-relative">
              <i className="bi-search text-muted position-absolute top-50 start-3 translate-middle-y ms-3"></i>
              <input
                type="text"
                placeholder="Search products by title, category, brand..."
                className="form-control form-control-custom ps-5 py-3 rounded-4 shadow-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // delay to allow click selection
                style={{ background: theme === "light" ? "#fff" : "rgba(30,41,59,0.7)", color: "var(--text-main)" }}
              />
            </div>

            {/* Autocomplete Dropdown list */}
            {showSuggestions && suggestions.length > 0 && (
              <ul 
                className="filter-suggestions position-absolute w-100 list-unstyled mt-2 shadow-lg border p-2" 
                style={{ 
                  zIndex: 10, 
                  background: theme === "light" ? "rgba(255,255,255,0.98)" : "rgba(17,17,17,0.96)", 
                  borderColor: theme === "light" ? "rgba(17,17,17,0.08)" : "rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  maxHeight: "260px",
                  overflowY: "auto"
                }}
              >
                {suggestions.map((p) => (
                  <li key={p._id}>
                    <button 
                      onClick={() => {
                        setSearch(p.name);
                        setShowSuggestions(false);
                      }}
                      className="filter-suggestion-item btn btn-link text-decoration-none w-100 text-start px-3 py-2 small d-flex align-items-center gap-2"
                      style={{ color: "var(--text-main)" }}
                    >
                      <i className="bi-search text-muted small"></i>
                      <span>{p.name}</span>
                      <span className="badge ms-auto extra-small" style={{ background: "var(--color-accent-soft)", color: "var(--color-accent)", borderRadius: "999px" }}>{p.category}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sorting and Results Summary header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
            <p className="text-muted small mb-0">
              Showing <strong className="text-primary">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedProducts.length)}</strong> of <strong className="text-primary">{sortedProducts.length}</strong> items
            </p>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small fw-semibold text-nowrap">Sort By:</span>
              <select 
                className="form-select form-select-sm rounded-pill border-secondary border-opacity-25 filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  width: "180px", 
                  background: theme === "light" ? "#fff" : "rgba(17,17,17,0.72)", 
                  color: "var(--text-main)" 
                }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 mb-4 d-flex align-items-center">
              <i className="bi-exclamation-triangle-fill me-2 fs-5"></i>
              <span className="small fw-semibold">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="table-container p-5 text-center text-muted rounded-4 border">
              <i className="bi-search fs-1 mb-2 text-primary"></i>
              <h5 className="fw-bold mb-1">No Products Found</h5>
              <p className="mb-3 small">We couldn't find anything matching your filters or query.</p>
              <button onClick={handleClearFilters} className="btn btn-gradient btn-sm px-4 rounded-pill">Reset Filters</button>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="row g-4 mb-5">
                {currentItems.map((product) => (
                  <div key={product._id} className="col-12 col-sm-6 col-md-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-4">
                  <ul className="pagination gap-2">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className="btn btn-dark border border-secondary border-opacity-10 rounded-3 text-white px-3"
                        aria-label="Previous Page"
                      >
                        <i className="bi-chevron-left"></i>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <li key={idx} className="page-item">
                        <button
                          onClick={() => paginate(idx + 1)}
                          className={`btn rounded-3 px-3 fw-bold ${currentPage === idx + 1 ? "btn-primary text-white" : "btn-dark border border-secondary border-opacity-10 text-muted"}`}
                        >
                          {idx + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className="btn btn-dark border border-secondary border-opacity-10 rounded-3 text-white px-3"
                        aria-label="Next Page"
                      >
                        <i className="bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
