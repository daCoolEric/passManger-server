const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accountSchema = new Schema({
  userID: {
    type: String,
    required: true
    },
  accountType: {
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
  passcode: {
    type: String,
    required: true
  },
  decryptedPassword: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  sk: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('accounts', accountSchema)