// const mongoose = require("mongoose");

// const Schema = mongoose.Schema;

// const userSchema = new Schema(
//   {
//     firstname: { type: String, required: true },
//     lastname: { type: String, required: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     // bcrypt hash of the client-derived authentication hash.
//     // This is NOT the master password and NOT the encryption key.
//     password: { type: String, required: true },
//     // Per-user salt the client uses to re-derive the vault encryption key
//     // from the master password. Public by design; useless without the
//     // master password, which the server never sees.
//     encryptionSalt: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("users", userSchema);

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.js");

const TOKEN_TTL = "1h";

const signToken = (user) =>
  jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });

// Strip everything the client must never receive.
const publicUser = (user) => ({
  _id: user._id,
  firstname: user.firstname,
  lastname: user.lastname,
  email: user.email,
  // The encryption salt is NOT secret — the client needs it to re-derive
  // the vault key locally. It is safe to return.
  encryptionSalt: user.encryptionSalt,
});

// ---------------------------------------------------------------------------
// IMPORTANT: the `authHash` received here is NOT the user's master password.
// The browser derives it from the master password (PBKDF2, auth salt) and
// only ever sends this derived value. The server bcrypts it a second time,
// so even the auth hash is never stored in a usable form. The server never
// sees, and cannot derive, the encryption key.
// ---------------------------------------------------------------------------

const signup = async (req, res) => {
  const { firstname, lastname, email, authHash, encryptionSalt } = req.body;

  if (!firstname || !lastname || !email || !authHash || !encryptionSalt) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedAuth = await bcrypt.hash(authHash, salt);

    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashedAuth, // bcrypt(client-derived auth hash)
      encryptionSalt, // client-generated, used for local key derivation
    });

    const token = signToken(user);
    return res.status(201).json({ result: publicUser(user), token });
  } catch (err) {
    console.error("signup error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, authHash } = req.body;

  if (!email || !authHash) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const user = await UserModel.findOne({ email });
    // Generic message + same code path to avoid leaking which part failed.
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(authHash, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.status(200).json({ result: publicUser(user), token });
  } catch (err) {
    console.error("signin error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signin, signup };
