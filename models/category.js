const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	parentCategory: { //if set to null upon instantiation makes the category the parent one
		type: mongoose.Schema.Types.ObjectId, //The id of the parent category
		ref: 'Category',
	},


});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
