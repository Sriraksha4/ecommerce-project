import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user exist in local storage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, adminLogin = false) => {
    try {
      const response = await API.post("/users/login", { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      // Customer login should not allow admins
if (!adminLogin && receivedUser.role === "admin") {
  return {
    success: false,
    message: "Please use the Admin Login portal."
  };
}

// Admin login should not allow customers
if (adminLogin && receivedUser.role !== "admin") {
  return {
    success: false,
    message: "Administrator access only."
  };
}
      
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("user", JSON.stringify(receivedUser));
      
      setToken(receivedToken);
      setUser(receivedUser);
      return { success: true, user: receivedUser, message: response.data.message || "Logged in successfully" };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Login failed. Please check credentials.";
      return { success: false, message: errMsg };
    }
  };

  const register = async (name, email, phone, password, confirmPassword) => {
    try {
      const response = await API.post("/users/register", { name, email, phone, password, confirmPassword });
      return { success: true, message: response.data.message || "Registration successful! Please login." };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed.";
      return { success: false, message: errMsg };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await API.put("/users/profile", profileData);
      const updatedUser = response.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, message: response.data.message || "Profile updated successfully" };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Profile update failed.";
      return { success: false, message: errMsg };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await API.put("/users/change-password", { oldPassword, newPassword });
      return { success: true, message: response.data.message || "Password changed successfully" };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Password change failed.";
      return { success: false, message: errMsg };
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const response = await API.post("/users/wishlist", { productId });
      // Update local storage and state with new wishlist array
      const updatedUser = { ...user, wishlist: response.data.wishlist };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, message: response.data.message || "Wishlist updated" };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to update wishlist.";
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, changePassword, toggleWishlist, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
