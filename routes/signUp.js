const express = require('express');
const router = express.Router();
const getEmails = require('../controllers/allEmails')

router.get("/all", (req, res) => {
    res.json("Homepage");
})

router.get("/emails", getEmails)

router.get("/social-media", (req, res) => {
    res.json("All social media accounts");
})

router.get("/e-wallets", (req, res) => {
    res.json("All e-wallets");
})

router.get("/favorites", (req, res) => {
    res.json("All e-wallets");
})

router.get("/recent", (req, res) => {
    res.json("All e-wallets");
})






module.exports = router;