const express = require('express');
const router = express.Router();

// importing all accounts controllers
const getAllAccounts = require('../controllers/allAccounts');

// importing email controllers
const Emails = require('../controllers/allEmails');

// importing social media controllers
const SocialMedia = require('../controllers/allSocialMedia');

// importing ewallets controllers
const EWallets = require('../controllers/allEWallets');


// importing favorites controllers
const Favorites = require('../controllers/favorites');

// all accounts srevices
router.get("/:userID/all", getAllAccounts)

// email services
router.get("/:userID/emails", Emails.getEmails);
router.post("/:userID/emails/decrypt-password", Emails.decryptPassword);
router.post("/:userID/emails/add-email", Emails.addEmail);
router.patch("/:userID/emails/update-email", Emails.updateEmail);
router.delete("/:userID/emails/delete-email", Emails.deleteEmail);

// social media services
router.get("/:userID/social-media", SocialMedia.getSocialMedia);
router.post("/:userID/social-media/decrypt-password", Emails.decryptPassword);
router.post("/:userID/social-media", SocialMedia.addSocialMedia);
router.patch("/:userID/social-media/:socialmediaID", SocialMedia.updateSocialMedia);
router.delete("/:userID/social-media/:socialmediaID", SocialMedia.deleteSocialMedia);

// e-wallets services
router.get("/:userID/e-wallets", EWallets.getEWallets);
router.post("/:userID/e-wallets/decrypt-password", Emails.decryptPassword);
router.post("/:userID/e-wallets", EWallets.addEWallet);
router.patch("/:userID/e-wallets/:ewalletID", EWallets.updateEWallet);
router.delete("/:userID/e-wallets/:ewalletID", EWallets.deleteEWallet); 


// favorite accounts services
router.get("/:userID/favorites", Favorites.getFavorites);
router.post("/:userID/favorites", Favorites.addFavorite);
router.delete("/:userID/favorites/:accountID", Favorites.deleteFavorite);








module.exports = router;