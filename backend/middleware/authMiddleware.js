const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = (req, res, next) => {
    let token;
if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
        try {
    const decoded = jwt.verify(token, "mysecretkey");

    console.log(decoded);   // ADD THIS LINE

    req.user = decoded;
    next();
} catch (error) {
    res.status(401).json({ message: "Not Authorized" });
}
    }

    if (!token) {
        res.status(401).json({ message: "No Token" });
    }
};

module.exports = { protect };