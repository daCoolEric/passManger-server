const AccountModal = require( "../models/account.js");

const getAllAccounts = async (req, res) => {
    const { userID } = req.params;
    const allAccounts = await AccountModal.find({userID});

  res.status(200).json(allAccounts)
}



module.exports = getAllAccounts;