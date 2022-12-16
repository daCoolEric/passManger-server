
const getFavorites = (req, res) => {
    res.json("All emails");
}

const addFavorite = (req, res) => {
    res.json("Add email address");
}

const deleteFavorite = async (req, res) => {
    const { id } = req.body
    const { userID } = req.params
  
    const allFavorites = await AccountModal.findOneAndDelete({ _id: id, userID })
  
    if(!allFavorites) {
      return res.status(400).json({error: 'No such favorite'})
    }
  
    res.status(200).json(allFavorites)
  }


module.exports = { getFavorites, addFavorite, deleteFavorite};