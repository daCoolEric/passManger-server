const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // bcrypt hash of the client-derived authentication hash.
    // This is NOT the master password and NOT the encryption key.
    password: { type: String, required: true },
    // Per-user salt the client uses to re-derive the vault encryption key
    // from the master password. Public by design; useless without the
    // master password, which the server never sees.
    encryptionSalt: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
