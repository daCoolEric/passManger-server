const AccountModel = require("../models/account.js");

// All handlers assume verifyToken + requireSelf have already run, so
// req.params.userID is the authenticated user. The server performs NO
// encryption or decryption — it only stores and returns ciphertext.

// GET all accounts for a user (optionally filtered by type via query).
const getAccounts = async (req, res) => {
  const { userID } = req.params;
  const { type } = req.query;
  const filter = type ? { userID, accountType: type } : { userID };
  const accounts = await AccountModel.find(filter).sort({ createdAt: -1 });
  return res.status(200).json(accounts);
};

// CREATE: client sends already-encrypted { ciphertext, iv }.
const addAccount = async (req, res) => {
  const { userID } = req.params;
  const { accountType, accountName, userName, ciphertext, iv } = req.body;

  if (!accountType || !accountName || !userName || !ciphertext || !iv) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const account = await AccountModel.create({
      userID,
      accountType,
      accountName,
      userName,
      ciphertext,
      iv,
    });
    return res.status(201).json(account);
  } catch (err) {
    console.error("addAccount error:", err.message);
    return res.status(500).json({ message: "Could not create account" });
  }
};

// UPDATE: client re-encrypts and sends new { ciphertext, iv }.
const updateAccount = async (req, res) => {
  const { userID, id } = req.params;
  const { accountName, userName, ciphertext, iv } = req.body;

  try {
    const updated = await AccountModel.findOneAndUpdate(
      { _id: id, userID },
      { accountName, userName, ciphertext, iv },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Account not found" });
    }
    return res.status(200).json(updated);
  } catch (err) {
    console.error("updateAccount error:", err.message);
    return res.status(500).json({ message: "Could not update account" });
  }
};

// DELETE
const deleteAccount = async (req, res) => {
  const { userID, id } = req.params;
  try {
    const deleted = await AccountModel.findOneAndDelete({ _id: id, userID });
    if (!deleted) {
      return res.status(404).json({ message: "Account not found" });
    }
    return res.status(200).json({ _id: deleted._id });
  } catch (err) {
    console.error("deleteAccount error:", err.message);
    return res.status(500).json({ message: "Could not delete account" });
  }
};

module.exports = { getAccounts, addAccount, updateAccount, deleteAccount };
