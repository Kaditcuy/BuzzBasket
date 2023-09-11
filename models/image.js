const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Reference to the entity (e.g User, Product) the image is associated with
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // An array of strings to store image tags
  tags: [String],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },

});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
