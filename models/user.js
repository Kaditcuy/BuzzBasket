const mongoose = require('mongoose');
// const Address = require('./address');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures each username is unique
  },
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: {
    type: mongoose.Schema.Types.ObjectID, // also means type will be a unique id
    ref: 'Address',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
