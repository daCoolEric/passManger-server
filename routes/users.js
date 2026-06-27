const express = require("express");
const router = express.Router();

const { signin, signup } = require("../controllers/user.js");
const { prelogin } = require("../controllers/prelogin.js");

router.post("/signup", signup);
router.post("/prelogin", prelogin); // returns encryptionSalt for a given email
router.post("/signin", signin);

module.exports = router;
