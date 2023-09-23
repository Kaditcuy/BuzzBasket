const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { v4: uuidv4 } = require('uuid');
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
    required: false,
    default: uuidv4(),
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
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: [
	{
    type: mongoose.Schema.Types.ObjectID, // also means type will be a unique id
    ref: 'Address',
  },
],
  resetToken: String,
  resetPasswordExpires: Date,
});

//Add passport-local mongoose to the user schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
