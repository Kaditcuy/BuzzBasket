const ShippingMethod = require('../models/shipping');

exports.createShippingMethod = async (req, res) => {
  try {
    // Extract shipping method details from the request body
    const { name, description, price, estimatedDeliveryTime } = req.body;

    // Create a new shipping method
    const shippingMethod = new ShippingMethod({
      name,
      description,
      price,
      estimatedDeliveryTime,
    });

    // Save the new shipping method to the database
    const savedShippingMethod = await shippingMethod.save();

    res.status(201).json(savedShippingMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getShippingMethods = async (req, res) => {
  try {
    // Retrieve all shipping methods from the database
    const shippingMethods = await ShippingMethod.find();

    res.status(200).json(shippingMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getShippingMethodById = async (req, res) => {
  try {
    // Retrieve the shipping method by ID from the database
    const shippingMethod = await ShippingMethod.findById(req.params.shippingId);

    if (!shippingMethod) {
      return res.status(404).json({ error: 'Shipping method not found' });
    }

    res.status(200).json(shippingMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateShippingMethod = async (req, res) => {
  try {
    const { shippingId } = req.params;
    const updatedShippingData = req.body; // You can expect the updated shipping data in the request body

    // Find the shipping method by ID and update it
    const updatedShipping = await Shipping.findByIdAndUpdate(
      shippingId,
      updatedShippingData,
      { new: true } // Return the updated document
    );

    if (!updatedShipping) {
      return res.status(404).json({ message: 'Shipping method not found' });
    }

    res.status(200).json(updatedShipping);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteShippingMethod = async (req, res) => {
  try {
    const { shippingId } = req.params;

    // Find the shipping method by ID and delete it
    const deletedShipping = await Shipping.findByIdAndDelete(shippingId);

    if (!deletedShipping) {
      return res.status(404).json({ message: 'Shipping method not found' });
    }

    res.status(200).json({ message: 'Shipping method deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.calculateShippingCost = async (req, res) => {
  try {
    // You can retrieve order details or shipping parameters from the request body
    const { weight, destination, shippingMethod } = req.body;

    // Calculate shipping cost based on your business logic
    // For simplicity, let's assume a fixed rate of $10 per kg
    const ratePerKg = 10;
    const shippingCost = weight * ratePerKg;

    // You can adjust the shipping cost calculation based on your needs

    // Return the calculated shipping cost in the response
    res.status(200).json({ shippingCost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};