import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch analytical summary stats
        const statsRes = await API.get("/analytics/dashboard");
        setStats(statsRes.data);

        // Fetch recent orders
        const ordersRes = await API.get("/orders");
        // Sort and slice top 5 recent orders
        const orders = ordersRes.data || [];
        setRecentOrders(orders.slice(-5).reverse());

        // Fetch recent products
        const productsRes = await API.get("/products");
        const products = productsRes.data || [];
        setRecentProducts(products.slice(-5).reverse());

        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Could not load dashboard data. Please make sure the backend is active.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {error && (
        <div className="alert alert-warning border-0 bg-warning bg-opacity-10 text-warning rounded-3 p-3 mb-4 d-flex align-items-center">
          <i className="bi-exclamation-triangle-fill me-2 fs-5"></i>
          <span className="small fw-semibold">{error}</span>
        </div>
      )}

      {/* Welcome & Overview Row */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="text-dark fw-bold m-0">E-Commerce Overview</h2>
          <p className="text-muted small mb-0">Real-time statistics and summary of your store</p>
        </div>
        <Link to="/analytics" className="btn btn-gradient btn-sm d-flex align-items-center">
          <i className="bi-graph-up-arrow me-2"></i> View Deep Analytics
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="row g-4 mb-4">
        {/* Revenue Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-card-icon icon-green">
              <i className="bi-currency-rupee"></i>
            </div>
            <span className="text-muted small fw-bold">TOTAL REVENUE</span>
            <h3 className="text-dark fw-extrabold mt-1 mb-0">
  ₹{stats.totalRevenue?.toLocaleString("en-IN") || "0"}
</h3>
            <div className="small mt-2 text-success fw-semibold">
              <i className="bi-arrow-up-short"></i> +12.5% <span className="text-muted fw-normal">since last month</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-card-icon icon-blue">
              <i className="bi-cart-check"></i>
            </div>
            <span className="text-muted small fw-bold">TOTAL ORDERS</span>
            <h3 className="text-dark fw-extrabold mt-1 mb-0">{stats.totalOrders}</h3>
            <div className="small mt-2 text-primary fw-semibold">
              <i className="bi-arrow-up-short"></i> +8.2% <span className="text-muted fw-normal">since last week</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-card-icon icon-purple">
              <i className="bi-box-seam"></i>
            </div>
            <span className="text-muted small fw-bold">ACTIVE PRODUCTS</span>
            <h3 className="text-dark fw-extrabold mt-1 mb-0">{stats.totalProducts}</h3>
            <div className="small mt-2 text-purple fw-semibold">
              <i className="bi-plus-short"></i> New Categories added
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-card-icon icon-yellow">
              <i className="bi-people"></i>
            </div>
            <span className="text-muted small fw-bold">TOTAL CUSTOMERS</span>
            <h3 className="text-dark fw-extrabold mt-1 mb-0">{stats.totalUsers}</h3>
            <div className="small mt-2 text-warning fw-semibold">
              <i className="bi-arrow-up-short"></i> +4.1% <span className="text-muted fw-normal">active users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Overview Split Grid */}
      <div className="row g-4 mb-4">
        {/* Recent Orders List */}
        <div className="col-12 col-xl-7">
          <div className="table-container p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark fw-bold m-0">Recent Orders</h5>
              <Link to="/orders" className="text-primary small text-decoration-none fw-bold">
                View All <i className="bi-arrow-right-short"></i>
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi-cart-x fs-1 mb-2"></i>
                <p className="mb-0">No orders recorded yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom align-middle">
                  <thead>
                    <tr>
                      <th>CUSTOMER</th>
                      <th>ITEMS</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <div className="fw-semibold text-dark">{order.user?.name || "Deleted User"}</div>
                          <div className="text-muted small" style={{ fontSize: "0.75rem" }}>{order.user?.email || ""}</div>
                        </td>
                        <td>
                          <span className="badge bg-secondary bg-opacity-25 text-dark">
                            {order.products?.length || 0} product(s)
                          </span>
                        </td>
                        <td className="fw-bold text-dark">
  ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
</td>
                        <td>
                          <span className={`badge-status badge-${order.status?.toLowerCase() || "pending"}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="col-12 col-xl-5">
          <div className="table-container p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark fw-bold m-0">New Products</h5>
              <Link to="/products" className="text-primary small text-decoration-none fw-bold">
                Manage <i className="bi-arrow-right-short"></i>
              </Link>
            </div>
            {recentProducts.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi-box-seam fs-1 mb-2"></i>
                <p className="mb-0">No products added yet.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {recentProducts.map((product) => (
                  <div key={product._id} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                    <div className="d-flex align-items-center gap-3">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="rounded-3" style={{ width: "45px", height: "45px", objectFit: "cover" }} />
                      ) : (
                        <div className="bg-dark rounded-3 d-flex align-items-center justify-content-center text-muted" style={{ width: "45px", height: "45px" }}>
                          <i className="bi-image"></i>
                        </div>
                      )}
                      <div>
                        <div className="fw-semibold text-dark small">{product.name}</div>
                        <div className="text-muted extra-small" style={{ fontSize: "0.75rem" }}>{product.category}</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-dark">
  ₹{Number(product.price || 0).toLocaleString("en-IN")}
</div>
                      <div className={`extra-small ${product.stock <= 5 ? "text-danger fw-bold" : "text-muted"}`} style={{ fontSize: "0.7rem" }}>
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="p-4 rounded-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-2" style={{ background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
        <div>
          <h5 className="text-dark fw-bold mb-1">Quick Actions Console</h5>
          <p className="text-muted small mb-0">Perform administrative operations directly without leaving this screen</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/products" className="btn btn-dark border border-secondary border-opacity-25 btn-sm px-3 rounded-3">
            <i className="bi-plus-circle-fill text-primary me-2"></i> Add Product
          </Link>
          <Link to="/categories" className="btn btn-dark border border-secondary border-opacity-25 btn-sm px-3 rounded-3">
            <i className="bi-tags-fill text-purple me-2"></i> Add Category
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;