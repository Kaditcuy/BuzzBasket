const mongoose = require('mongoose');
// const Product = require('./product');
// const User = require('./user');
// const Address = require('./address');
// const Payment = require('./payment');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,

  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // minimum quantity should be 1
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0, // Minimum total amount must be a positive number
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  shippingDetails: {
	   address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
	    method: {
      type: String,
      required: true,
      enum: ['Standard', 'Express', 'Next-Day', 'Others'],
    },
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'paymentMethod',
    required: true,
  },

});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
