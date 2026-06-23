const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    getAllUsers
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllUsers);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;