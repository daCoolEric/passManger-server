const crypto = require("crypto");
const UserModel = require("../models/user.js");

// Returns the encryptionSalt the client needs to derive its keys at login.
// Salts are NOT secret (standard for Bitwarden/1Password-style KDFs).
//
// Enumeration mitigation: if the email is unknown we still return a salt —
// one deterministically derived from the email + a server-side pepper — so
// the response is indistinguishable from a real account. An attacker cannot
// tell from this endpoint whether an email is registered. Login itself still
// fails for non-existent users (generic "Invalid credentials").
const prelogin = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(200).json({ encryptionSalt: user.encryptionSalt });
    }

    // Deterministic decoy salt: same email always yields the same value,
    // so repeated probes can't distinguish a real vs fake account by timing
    // or by salt variation. Uses a server pepper so decoys aren't guessable.
    const pepper = process.env.PRELOGIN_PEPPER || process.env.JWT_SECRET;
    const decoy = crypto
      .createHmac("sha256", pepper)
      .update(email.toLowerCase())
      .digest("base64")
      .slice(0, 24); // ~16 bytes base64, matches generateSalt() shape

    return res.status(200).json({ encryptionSalt: decoy });
  } catch (err) {
    console.error("prelogin error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { prelogin };
