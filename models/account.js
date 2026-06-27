const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// The server stores ONLY opaque ciphertext. It holds no key and cannot
// decrypt any of this. `ciphertext` and `iv` are produced by the browser
// using AES-GCM with a key derived from the user's master password.
const accountSchema = new Schema(
  {
    userID: { type: String, required: true, index: true },
    accountType: { type: String, required: true }, // email | social media | ewallet
    accountName: { type: String, required: true },
    userName: { type: String, required: true },
    // AES-GCM encrypted password, hex/base64 string. Opaque to the server.
    ciphertext: { type: String, required: true },
    // Initialization vector for this entry, hex/base64 string.
    iv: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("accounts", accountSchema);
