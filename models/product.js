const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // minimum price should be non-negative
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'CLothing', 'Books', 'Digital Proucts', 'Others'],
  },
  imageUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
