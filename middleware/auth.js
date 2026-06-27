const jwt = require("jsonwebtoken");

// Verifies the JWT in the Authorization header and attaches the decoded
// payload to req.auth. Routes that touch a user's vault must use this.
const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

// Ensures the authenticated user can only act on their OWN data.
// Compares the token's id against the :userID route param.
const requireSelf = (req, res, next) => {
  if (!req.auth || req.auth.id !== req.params.userID) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = { verifyToken, requireSelf };
