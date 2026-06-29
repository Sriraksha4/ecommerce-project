const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    deleteProfile,
    toggleWishlist,
    getWishlist,
    toggleUserActiveStatus,
    getAllUsers
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Admin routes
router.get("/", protect, getAllUsers);
router.put("/status/:id", protect, toggleUserActiveStatus);

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);
router.put("/change-password", protect, changePassword);

// Wishlist routes
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, toggleWishlist);

module.exports = router;