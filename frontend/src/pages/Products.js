import React, { useState, useEffect } from "react";
import API from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  // AI Generator local state inside modals
  const [aiWriting, setAiWriting] = useState(false);

  const fetchProductsAndCategories = async () => {
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
      setError("Could not load products. Make sure the backend is active.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: "",
    });
    setEditingId(null);
  };

  const handleAiGenerateDescription = async () => {
    if (!formData.name) {
      alert("Please enter a Product Name first so the AI has context.");
      return;
    }
    setAiWriting(true);
    try {
      const response = await API.post("/ai/generate-description", {
        productName: formData.name,
        specifications: `Category: ${formData.category || "General"}`,
        features: "Premium standard edition",
        targetAudience: "General Public"
      });
      if (response.data.success) {
        // Handle structured JSON format or legacy plain text
        const desc = response.data.data?.description || response.data.description;
        if (desc) {
          setFormData((prev) => ({
            ...prev,
            description: desc,
          }));
        } else {
          alert("AI response did not contain a description copy.");
        }
      } else {
        alert("AI generation did not return a description copy.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to call AI copywriting models. Verify server API connection.");
    } finally {
      setAiWriting(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, description, price, stock, category } = formData;
    if (!name || !description || !price || !stock || !category) {
      setError("All fields except image are required.");
      return;
    }

    try {
      const response = await API.post("/products", {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        image: formData.image || "",
      });
      setSuccess(response.data.message || "Product created successfully.");
      setShowAddModal(false);
      resetForm();
      fetchProductsAndCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, description, price, stock, category } = formData;
    if (!name || !description || !price || !stock || !category) {
      setError("All fields except image are required.");
      return;
    }

    try {
      const response = await API.put(`/products/${editingId}`, {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        image: formData.image || "",
      });
      setSuccess(response.data.message || "Product updated successfully.");
      setShowEditModal(false);
      resetForm();
      fetchProductsAndCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product.");
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");

    try {
      const response = await API.delete(`/products/${id}`);
      setSuccess(response.data.message || "Product deleted successfully.");
      fetchProductsAndCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fade-in">
      {/* Notifications */}
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
          <h2 className="text-white fw-bold m-0">Products Catalog</h2>
          <p className="text-muted small mb-0">Create, search, edit, and manage products</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="btn btn-gradient d-flex align-items-center"
        >
          <i className="bi-plus-circle me-2"></i> Add Product
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="position-relative">
            <i className="bi-search text-muted position-absolute top-50 start-3 translate-middle-y ms-3"></i>
            <input
              type="text"
              placeholder="Search products by name or description..."
              className="form-control form-control-custom ps-5 py-3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="position-relative">
            <i className="bi-funnel text-muted position-absolute top-50 start-3 translate-middle-y ms-3"></i>
            <select
              className="form-select form-control-custom ps-5 py-3"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="table-container p-5 text-center text-muted">
          <i className="bi-search fs-1 mb-2"></i>
          <p className="mb-0">No products matching the selected filters found.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>IMAGE</th>
                  <th>NAME & DESCRIPTION</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK STATUS</th>
                  <th className="text-center" style={{ width: "120px" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="rounded-3"
                          style={{ width: "50px", height: "50px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.05)" }}
                        />
                      ) : (
                        <div className="bg-dark rounded-3 d-flex align-items-center justify-content-center text-muted" style={{ width: "50px", height: "50px" }}>
                          <i className="bi-image"></i>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-white mb-0">{product.name}</div>
                      <div className="text-muted small text-truncate" style={{ maxWidth: "250px" }}>{product.description}</div>
                    </td>
                    <td>
                      <span className="badge bg-dark bg-opacity-50 border border-secondary border-opacity-25 text-muted px-2 py-1">
                        {product.category}
                      </span>
                    </td>
                    <td className="fw-bold text-white">${product.price.toLocaleString("en-IN")}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className={`badge-status badge-${
                            product.stock === 0
                              ? "cancelled"
                              : product.stock <= 5
                              ? "pending"
                              : "delivered"
                          }`}
                        >
                          {product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? "Low Stock" : "In Stock"}
                        </span>
                        <span className="text-muted small">({product.stock} left)</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="btn btn-outline-primary btn-sm rounded-3 px-3 border-secondary border-opacity-25 text-white"
                          title="Edit"
                        >
                          <i className="bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product._id)}
                          className="btn btn-outline-danger btn-sm rounded-3 px-3 border-secondary border-opacity-25 text-danger"
                          title="Delete"
                        >
                          <i className="bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: "1050" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h5 className="modal-title fw-bold text-white">Add New Product</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">PRODUCT NAME</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-custom"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label text-muted small fw-bold mb-0">DESCRIPTION</label>
                      <button
                        type="button"
                        onClick={handleAiGenerateDescription}
                        className="btn btn-link text-primary p-0 small text-decoration-none fw-bold"
                        disabled={aiWriting}
                      >
                        {aiWriting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Writing...
                          </>
                        ) : (
                          "✨ AI Generate Copy"
                        )}
                      </button>
                    </div>
                    <textarea
                      name="description"
                      className="form-control form-control-custom"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">PRICE (₹)</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control form-control-custom"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">STOCK QUANTITY</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control form-control-custom"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">CATEGORY</label>
                    <select
                      name="category"
                      className="form-select form-control-custom"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">IMAGE URL (OPTIONAL)</label>
                    <input
                      type="text"
                      name="image"
                      className="form-control form-control-custom"
                      placeholder="https://example.com/product.jpg"
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer modal-footer-custom">
                  <button
                    type="button"
                    className="btn btn-gradient-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gradient">
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: "1050" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h5 className="modal-title fw-bold text-white">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">PRODUCT NAME</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-custom"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label text-muted small fw-bold mb-0">DESCRIPTION</label>
                      <button
                        type="button"
                        onClick={handleAiGenerateDescription}
                        className="btn btn-link text-primary p-0 small text-decoration-none fw-bold"
                        disabled={aiWriting}
                      >
                        {aiWriting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Writing...
                          </>
                        ) : (
                          "✨ AI Generate Copy"
                        )}
                      </button>
                    </div>
                    <textarea
                      name="description"
                      className="form-control form-control-custom"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">PRICE (₹)</label>
                      <input
                        type="number"
                        name="price"
                        className="form-control form-control-custom"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">STOCK QUANTITY</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control form-control-custom"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">CATEGORY</label>
                    <select
                      name="category"
                      className="form-select form-control-custom"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">IMAGE URL</label>
                    <input
                      type="text"
                      name="image"
                      className="form-control form-control-custom"
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer modal-footer-custom">
                  <button
                    type="button"
                    className="btn btn-gradient-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gradient">
                    Save Changes
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

export default Products;