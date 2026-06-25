import React, { useState, useEffect } from "react";
import API from "../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await API.get("/categories");
      setCategories(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories. Make sure the backend is active.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name) {
      setError("Category Name is required.");
      return;
    }

    try {
      if (editingId) {
        // Edit Category
        const response = await API.put(`/categories/${editingId}`, formData);
        setSuccess(response.data.message || "Category updated successfully.");
      } else {
        // Add Category
        const response = await API.post("/categories", formData);
        setSuccess(response.data.message || "Category created successfully.");
      }
      setFormData({ name: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save category.");
    }
  };

  const handleEditClick = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? Products linked to it will not be deleted but may show an unlinked state.")) return;
    setError("");
    setSuccess("");

    try {
      const response = await API.delete(`/categories/${id}`);
      setSuccess(response.data.message || "Category deleted successfully.");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

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
      <div className="mb-4">
        <h2 className="text-white fw-bold m-0">Categories Configuration</h2>
        <p className="text-muted small mb-0">Organize products into distinct groupings and classification shelves</p>
      </div>

      <div className="row g-4">
        {/* Category Form Side */}
        <div className="col-12 col-lg-4">
          <div className="table-container p-4">
            <h5 className="text-white fw-bold mb-3">
              {editingId ? "Modify Category" : "Add New Category"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">CATEGORY NAME</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-custom"
                  placeholder="e.g. Electronics, Clothing"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">DESCRIPTION</label>
                <textarea
                  name="description"
                  className="form-control form-control-custom"
                  rows="4"
                  placeholder="Summarize what items fall under this category..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-gradient flex-grow-1">
                  {editingId ? "Save Changes" : "Create Category"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-gradient-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Category Table Side */}
        <div className="col-12 col-lg-8">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="table-container p-5 text-center text-muted">
              <i className="bi-tags fs-1 mb-2"></i>
              <p className="mb-0">No categories found. Start by creating one on the left.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-responsive">
                <table className="table table-custom align-middle">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>DESCRIPTION</th>
                      <th>CREATED ON</th>
                      <th className="text-center" style={{ width: "120px" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} className={editingId === cat._id ? "bg-primary bg-opacity-10" : ""}>
                        <td className="fw-bold text-white">{cat.name}</td>
                        <td>
                          <span className="text-muted small">
                            {cat.description || "No description provided."}
                          </span>
                        </td>
                        <td className="small text-muted" style={{ fontSize: "0.8rem" }}>
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="btn btn-outline-primary btn-sm rounded-3 px-3 border-secondary border-opacity-25 text-white"
                              title="Edit"
                            >
                              <i className="bi-pencil"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(cat._id)}
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
        </div>
      </div>
    </div>
  );
};

export default Categories;
