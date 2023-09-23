const Address = require('../models/address'); 
const User = require('../models/user');

exports.createAddress = async (req, res) => {
  try {
    // Get address details from the request body
    const { userId, street, city, state, postalCode, country } = req.body;

    // Create a new address instance
    const newAddress = new Address({
      userId, // Reference to the user to whom this address belongs
      street,
      city,
      state,
      postalCode,
      country,
    });

    // Save the new address to the database
    const savedAddress = await newAddress.save();

    res.status(201).json(savedAddress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserAddresses = async (req, res) => {
    try {
      // Get the user's ID from the route parameters
      const { userId } = req.params;
  
      // Find all addresses associated with the user ID
      const userAddresses = await Address.find({ userId });
  
      res.status(200).json(userAddresses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getAddressById = async (req, res) => {
    try {
      // Get the address ID from the route parameters
      const { addressId } = req.params;
  
      // Find the address by its ID
      const address = await Address.findById(addressId);
  
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      res.status(200).json(address);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.updateAddress = async (req, res) => {
    try {
      // Get the address ID from the route parameters
      const { addressId } = req.params;
  
      // Find the address by its ID
      let address = await Address.findById(addressId);
  
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      // Update address fields based on the request body
      address = {
        ...address,
        // Update fields you want to change based on req.body
        street: req.body.street,
        city: req.body.city,
        // Add more fields as needed
      };
  
      // Save the updated address
      await address.save();
  
      res.status(200).json({ message: 'Address updated successfully', address });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.deleteAddress = async (req, res) => {
    try {
      // Get the address ID from the route parameters
      const { addressId } = req.params;
  
      // Find the address by its ID and delete it
      const deletedAddress = await Address.findByIdAndDelete(addressId);
  
      if (!deletedAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.setDefaultAddress = async (req, res) => {
    try {
      // Get the user ID and address ID from the route parameters
      const { userId, addressId } = req.params;
  
      // Find the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the address by its ID
      const address = await Address.findById(addressId);
  
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
  
      // Set the user's default address to the specified address
      user.defaultAddress = addressId;
      await user.save();
  
      res.status(200).json({ message: 'Default address updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };