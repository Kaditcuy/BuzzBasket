const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category'); 
const Review = require('../models/review');
const fs = require('fs');
const multer = require('multer');

exports.getProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    // Get product data from the request body
    const { name, description, price, category } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      name,
      description,
      price,
      category,
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getProductById = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const { productId } = req.params;

    // Use the findById method to fetch the product from the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.updateProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const { productId } = req.params;

    // Get the updated product data from the request body
    const updatedProductData = req.body;

    // Use the findByIdAndUpdate method to update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true } // To return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const { productId } = req.params;

    // Use the findByIdAndDelete method to delete the product from the database
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(204).send(); // 204 status means No Content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.searchProducts = async (req, res) => {
  try {
    // Extract the search query from the query parameters
    const { query } = req.query;

    // Use a regular expression to perform a case-insensitive search for products
    const regex = new RegExp(query, 'i');

    // Find products that match the search query
    const matchingProducts = await Product.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
      ],
    });

    res.status(200).json(matchingProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.createProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating, text } = req.body;

    // Create a new review
    const newReview = new Review({
      user: userId, // Assuming you have a reference to the user who wrote the review
      product: productId,
      rating,
      text,
    });

    // Save the review to the database
    await newReview.save();

    // Add the review to the product's reviews array
    const product = await Product.findById(productId);
    product.reviews.push(newReview);
    await product.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadProductImages = upload.array('images', 5), async (req, res) => {
  try {
    const { productId } = req.params;
    const images = req.files;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Assuming you have a way to save these images to your storage (e.g., AWS S3, local file system, etc.)
    // Loop through the uploaded images and save them

    // For example, if you are using AWS S3 with the 'aws-sdk' library:
    // const AWS = require('aws-sdk');
    // const s3 = new AWS.S3();

    // for (const image of images) {
    //   const params = {
    //     Bucket: 'your-bucket-name',
    //     Key: `products/${productId}/${image.originalname}`,
    //     Body: image.buffer,
    //   };

    //   await s3.upload(params).promise();
    // }

    // After saving the images, you can update the product with image URLs
    // Example:
    // const imageUrls = images.map((image) => `https://your-bucket-url.com/products/${productId}/${image.originalname}`);
    // product.images = imageUrls;
    // await product.save();

    res.status(200).json({ message: 'Images uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.importProducts = async (req, res) => {
  try {
    // Read the JSON file with product data
    const data = fs.readFileSync('product_data.json', 'utf8');
    const products = JSON.parse(data);

    // Insert the products into your database
    await Product.insertMany(products);

    res.status(200).json({ message: 'Products imported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.getProductRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's data, including their preferences or behavior
    const user = await User.findById(userId).populate('preferences');

    // Use the user's data to generate product recommendations
    // You can implement your recommendation logic here

    // For demonstration purposes, let's assume we have a list of recommended product IDs
    const recommendedProductIds = ['product1', 'product2', 'product3'];

    // Fetch the recommended products from the database
    const recommendedProducts = await Product.find({ _id: { $in: recommendedProductIds } });

    res.status(200).json(recommendedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.updateProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { inventory } = req.body;

    // Validate that the inventory is a positive integer
    if (typeof inventory !== 'number' || inventory < 0) {
      return res.status(400).json({ error: 'Invalid inventory quantity' });
    }

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product's inventory
    product.inventory = inventory;

    // Save the updated product to the database
    await product.save();

    res.status(200).json({ message: 'Product inventory updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};