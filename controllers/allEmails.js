const { encrypt, decrypt } = require("./Crypto");
// const { encrypt, decrypt } = require("./EncryptionHandler.js");
const AccountModal = require( "../models/account.js");
const UserModal = require("../models/user.js")
const { ObjectId } = require('mongodb');

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
        // console.log(decryptedPassword);
        // res.data = decryptedPassword;
        
        // res.status(201).json({
        //   message: "decryptedPassword"
        // });
        res.send(decryptedPassword);
    }
        
   } catch (error) {
         console.log(error);
   }
   

    
}

const addEmail = async (req, res) => {
    req.body.userID = req.params.userID;
    const { userID , accountType, accountName, userName, password } = req.body;
    const obj = encrypt(password);
    const passcode = obj.EncryptedData;
    const iv = obj.iv;
    const sk = obj.sk;
    const decryptedPassword = "XXXXXXXX";
    
    try{
    const newEmail = await AccountModal.create({ userID , accountType, accountName, userName, passcode, decryptedPassword, iv, sk });
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
    // var myId = JSON.parse(id);
    const { accountName, userName, password } = req.body;
    const obj = encrypt(password);
    const passcode = obj.EncryptedData;
    const iv = obj.iv;
    const sk = obj.sk;
    const decryptedPassword = "XXXXXXXX";
  
    const updatedEmail = await AccountModal.findOneAndUpdate({_id: id , userID }, {
      userID , accountName, userName, passcode, decryptedPassword, iv, sk
    })
  
    if (!updatedEmail) {
      return res.status(400).json({error: 'No such email'})
    }
  
    res.status(200).json("Update was successful!!!")
  }

module.exports = { getEmails, decryptPassword, addEmail, deleteEmail, updateEmail };