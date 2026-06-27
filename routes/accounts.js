const express = require("express");
const router = express.Router();

const {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
} = require("../controllers/accounts");
const { verifyToken, requireSelf } = require("../middleware/auth");

// Every vault route is protected: valid token AND token.id === :userID.
// One unified set of routes handles email / social media / ewallet via the
// accountType field and an optional ?type= filter — no more duplicated
// per-type endpoints, and no decrypt-password endpoint (server can't decrypt).
router.use("/:userID", verifyToken, requireSelf);

router.get("/:userID/accounts", getAccounts);
router.post("/:userID/accounts", addAccount);
router.patch("/:userID/accounts/:id", updateAccount);
router.delete("/:userID/accounts/:id", deleteAccount);

module.exports = router;
