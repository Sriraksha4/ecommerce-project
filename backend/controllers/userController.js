const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        // Empty field validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Name validation
        if (name.trim().length < 3) {
            return res.status(400).json({
                message: "Name must contain at least 3 characters"
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // Phone number validation (simple format check)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Phone number must be exactly 10 digits"
            });
        }

        // Password matching validation
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Strong password criteria validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email is already registered"
            });
        }

        // Check if phone number already exists
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                message: "Phone number is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // email field contains either Email OR Phone number

        if (!email || !password) {
            return res.status(400).json({
                message: "Email/Phone and Password are required"
            });
        }

        // Find user by email or phone
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone: email }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if account is deactivated
        if (user.isActive === false) {
            return res.status(403).json({
                message: "Your account has been deactivated. Please contact support."
            });
        }

        // Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            "mysecretkey",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                address: user.address,
                profilePhoto: user.profilePhoto
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate("wishlist");
            
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Edit User Profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, address, profilePhoto } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validations if changing email/phone
        if (email && email.toLowerCase() !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            const existingEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already taken" });
            }
            user.email = email.toLowerCase();
        }

        if (phone && phone !== user.phone) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
            }
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ message: "Phone number already taken" });
            }
            user.phone = phone;
        }

        if (name) user.name = name;
        if (address) user.address = address;
        if (profilePhoto) user.profilePhoto = profilePhoto;

        await user.save();
        
        // Return populated profile
        const updatedUser = await User.findById(user._id).select("-password").populate("wishlist");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and New passwords are required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "New password must contain uppercase, lowercase, number, special character and minimum 8 characters"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add/Remove Wishlist
const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
            await user.save();
            return res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
        } else {    
            user.wishlist.push(productId);
            await user.save();
            return res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Wishlist Products
const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("wishlist");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Deactivate/Activate Customer account (Admin only)
const toggleUserActiveStatus = async (req, res) => {
    try {
        // Enforce admin check
        const adminUser = await User.findById(req.user.id);
        if (adminUser.role !== "admin") {
            return res.status(403).json({ message: "Not authorized as an admin" });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            message: `User account has been ${user.isActive ? "activated" : "deactivated"} successfully.`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    toggleWishlist,
    getWishlist,
    toggleUserActiveStatus,
    getAllUsers
};