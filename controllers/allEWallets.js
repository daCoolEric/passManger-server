const { encrypt, decrypt } = require("./EncryptionHandler");


const getEWallets = async (req, res) => {
    const { userID } = req.params;
    const accountName = "ewallet";
    const allEWallets = await AccountModal.find({userID, accountName});

  res.status(200).json(allEWallets)
    
}

const addEWallet = async (req, res) => {
    req.body.userID = req.params.userID;
    const { userID ,accountName, userName, password } = req.body;

    try{
    const newEWallet = await AccountModal.create({ userID , accountName, userName, password });
    console.log(req.params.userID);
    res.status(201).json(newEWallet);
    }
    catch(error){
        console.log(error);
    }
}

const deleteEWallet = async (req, res) => {
    const { id } = req.body
    const { userID } = req.params
  
    const allEWallets = await AccountModal.findOneAndDelete({ _id: id, userID })
  
    if(!allEWallets) {
      return res.status(400).json({error: 'No such e-wallet'})
    }
  
    res.status(200).json(allEWallets)
  }

const updateEWallet = async (req, res) => {
    const { id } = req.body
    const { userID } = req.params
  
    const updatedEWallet = await AccountModal.findOneAndUpdate({_id: id, userID }, {
      ...req.body
    })
  
    if (!updatedEWallet) {
      return res.status(400).json({error: 'No such e-wallet'})
    }
  
    res.status(200).json("Update was successful!!!")
  }

module.exports = { getEWallets, addEWallet, deleteEWallet, updateEWallet };