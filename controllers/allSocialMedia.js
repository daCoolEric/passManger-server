const { encrypt, decrypt } = require("./EncryptionHandler");

// read  
const getSocialMedia = async (req, res) => {
    const { userID } = req.params;
    const accountName = "social-media";
    const allSocialMedia = await AccountModal.find({userID, accountName});

  res.status(200).json(allSocialMedia)
}

// create
const addSocialMedia = async (req, res) => {
    req.body.userID = req.params.userID;
    const { userID ,accountName, userName, password } = req.body;

    try{
    const newSocialMedia = await AccountModal.create({ userID , accountName, userName, password });
    res.status(201).json(newSocialMedia);
    }
    catch(error){
        console.log(error);
    }
}

// delete 
const deleteSocialMedia = async (req, res) => {
    const { id } = req.body
    const { userID } = req.params
  
    const allSocialMedia = await AccountModal.findOneAndDelete({ _id: id, userID })
  
    if(!allSocialMedia) {
      return res.status(400).json({error: 'No such social media'})
    }
  
    res.status(200).json(allSocialMedia)
  }

// update  
const updateSocialMedia = async (req, res) => {
    const { id } = req.body
    const { userID } = req.params
  
    const updatedSocialMedia = await AccountModal.findOneAndUpdate({_id: id, userID }, {
      ...req.body
    })
  
    if (!updatedSocialMedia) {
      return res.status(400).json({error: 'No such social media'})
    }
  
    res.status(200).json("Update was successful!!!")
  }

module.exports = { getSocialMedia, addSocialMedia, deleteSocialMedia, updateSocialMedia };