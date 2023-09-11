const mongoose = require('mongoose');
// const Address = require('./address');

const paymentTypes = ['Credit Card', 'PayPal', 'Bank Transfer', 'Other'];

// Define PaymentMethods Schema, using a payment Centric Approach
const paymentMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObectId, // defining userId as a unique id
    ref: 'User', // Reference the user model
    required: true,
  },
  paymentType: {
    type: String,
    enum: paymentTypes,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: true,
  },
  billingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
});

const paymentMethod = mongoose.model('paymentMethod', paymentMethodSchema);

module.exports = paymentMethod;
