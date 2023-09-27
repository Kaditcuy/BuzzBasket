const mongoose = require('mongoose');
// const Product = require('./product');
// const User = require('./user');
// const Address = require('./address');
// const Payment = require('./payment');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,

  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
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
      required: false,
    },
	    method: {
      type: String,
      required: false,
      enum: ['Standard', 'Express', 'DHL', 'Others'],
    },
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'paymentMethod',
    required: false,
  },

});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
