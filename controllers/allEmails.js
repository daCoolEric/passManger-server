const { encrypt, decrypt } = require("./EncryptionHandler");
const AccountModal = require( "../models/account.js");
const UserModal = require("../models/user.js")

const getEmails = async (req, res) => {
    const { userID } = req.params;
    const accountName = "email";
    const allEmails = await AccountModal.find({userID, accountName});

  res.status(200).json(allEmails)

  
    
}

const decryptPassword = async (req, res) => {
   const { userID } = req.params; 
   const { id } = req.body;
   const validID = await UserModal.findById({_id: userID});
   try {
    if (!validID){
        res.status(404).json({message: "You are not authorised to view this password"});
    }else{
        const decryptedPassword = decrypt(req.body);
        console.log(decryptedPassword);
        res.status(201).json({id, password: decryptedPassword});
    }
        
   } catch (error) {
         console.log(error);
   }
   

    
}

const addEmail = async (req, res) => {
    req.body.userID = req.params.userID;
    const { userID ,accountName, userName, password } = req.body;
    const passcode = encrypt(password).password;
    const iv = encrypt(password).iv;

    try{
    const newEmail = await AccountModal.create({ userID , accountName, userName, passcode, iv });
    res.status(201).json(newEmail);
    }
    catch(error){
        console.log(error);
    }
}

const deleteEmail = async (req, res) => {
    const { userID, id } = req.params;
    const allEmails = await AccountModal.findOneAndDelete({ _id: id, userID })
  
    if(!allEmails) {
      return res.status(400).json({error: 'No such email'})
    }
  
    res.status(200).json(allEmails)
  }

const updateEmail = async (req, res) => {
    const { userID, id } = req.params
  
    const updatedEmail = await AccountModal.findOneAndUpdate({_id: id, userID }, {
      ...req.body
    })
  
    if (!updatedEmail) {
      return res.status(400).json({error: 'No such email'})
    }
  
    res.status(200).json("Update was successful!!!")
  }

module.exports = { getEmails, decryptPassword, addEmail, deleteEmail, updateEmail };