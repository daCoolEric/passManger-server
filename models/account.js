const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accountSchema = new Schema({
  userID: {
    type: String,
    required: true
    },
  accountName: {
    type: String,
    required: true
    },
  userName: {
    type: String,
    required: true
  },
  encryptedPassword: {
    type: Object,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('accounts', accountSchema)