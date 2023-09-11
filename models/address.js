const mongoose = require('mongoose')

const addressSchema = new mongoose.schema({
	street: String,
	city: String,
	state: String,
	postalCode: String,
	country: String,

});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
