const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find or create the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find((item) => item.product.equals(productId));

    if (existingItem) {
      // Product already in cart, update quantity
      existingItem.quantity += quantity || 1;
    } else {
      // Product not in cart, add a new item
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    // Save the updated cart
    await cart.save();

    res.status(201).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

