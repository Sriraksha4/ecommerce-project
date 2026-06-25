import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Storefront Components & Pages
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

// Admin Panel Components & Pages
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import AIGenerator from "./pages/AIGenerator";

// Auth & Guards
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout wrapper for Customer Storefront
const StorefrontLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "var(--body-bg)", color: "var(--text-main)" }}>
      <Navbar />
      <main className="flex-grow-1 py-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* --- Customer Storefront Routes --- */}
        <Route
          path="/"
          element={
            <StorefrontLayout>
              <Home />
            </StorefrontLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <StorefrontLayout>
              <Shop />
            </StorefrontLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <StorefrontLayout>
              <ProductDetails />
            </StorefrontLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <StorefrontLayout>
              <Cart />
            </StorefrontLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <Checkout />
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <MyOrders />
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <Profile />
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <StorefrontLayout>
                <Wishlist />
              </StorefrontLayout>
            </ProtectedRoute>
          }
        />

        {/* --- Administrative Panel Routes --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Orders />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-generator"
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout>
                <AIGenerator />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallbacks */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;