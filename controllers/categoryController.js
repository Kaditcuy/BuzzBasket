const Category = require('../models/category');

exports.createCategory = async (req, res) => {
  try {
    // Extract category information from the request body
    const { name, description } = req.body;

    // Create a new category using the Category model
    const newCategory = new Category({
      name,
      description,
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    // Return the created category in the response
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    // Retrieve all categories from the database
    const categories = await Category.find();

    // Return the list of categories in the response
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Retrieve the category by its ID from the database
    const category = await Category.findById(categoryId);

    // Check if the category exists
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Return the category in the response
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body; // Assuming you want to update the name and description

    // Find the category by its ID and update its properties
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true } // Return the updated category
    );

    // Check if the category exists
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Return the updated category in the response
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category by its ID and remove it from the database
    const deletedCategory = await Category.findByIdAndRemove(categoryId);

    // Check if the category exists
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Return a success message in the response
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
