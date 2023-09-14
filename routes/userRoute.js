const express = require('express')
const router = express.router();
const passport = require(passport);
const LocalStrategy = require('passport-local').Strategy;
const userController = require('../controllers/userController');
//Middleware for validation and sanitization of user input data
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');



/* ----------------Contains all Regular User Centric Actions ----------------------- */

// Middleware function to validate user input data during registration
// Note that its made up of an array of validation functions
const validateUserInput = [
	body('email').isEmail().normlaizeEmail(),
	body('password').isLength({min: 6, max: 15}),
	//i'll add more validation rules later
];

//Middleware function to sanitize user input to prevent XSS
function sanitizeUserData(req, res, next) {
	//remove harmful html/js
	req.body.email = sanitizeHtml(req.body.email);
	req.body.username = sanitizeHtml(req.body.username);
	req.body.password = sanitizeHtml(req.body.password);
	req.body.fullname = sanitizeHtml(req.body.fullname);
}


/* ------------------User Registration with Validation--------------------- */
//Route to create a new user with validation and sanitization middleware
router.post('/api/users/signup', validateUserInput, sanitizeUserData,  async(req, res) => {
	//Check for validation errors
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array() });
	}
	try {
		//Create a new user with the trusted sanitized data in the req.body
		const newUser = new User(req.body);
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal Server Error'});
});

/* --------------User authentication and  login------------------ */
router.post('/api/users/login', passport.authenticate('local'), (req, res) => {
	res.json({message: 'Login Successful', user: req.user});
});

// Route for currently  authenticated user to logout
router.post('/api/users/logout', userController.logoutUser);

// Route for initiating the forgotten-password process
router.post('/api/users/forgot-password', userController.initiateForgotPassword);

// Route to reset a user's password after receiving a reset token because it was forgotten
router.post('/api/users/reset-password', userController.resetUserPassword);

//Route for a user to retrieve his/her own profile info
router.get('/api/users/me', userController.getUserProfile);


/* ----------------User Profile Management-------------------- */
// Retrieve profile of a specific user by their user ID.
router.get('/api/users/:userId', userController.getUserProfile);

//Update/edit a user's profile information.
router.put('/api/users/:userId', userController.updateUserProfile);

//Allow users to change password whilst already authenticated.
router.put('/api/users/:userId', userController.changeUserPassword);


/* -----------------User Address Managment--------------------- */
//Retrieve a list of addresses associated with a user
router.get('/api/users/:userId/addresses', userController.getUserAddresses);

//add new address to a user's profile
router.post('/api/users/:userId/addresses', userController.addNewAddress);

//update/edit a user's address
router.put('/api/users/:userId/addresses/:addressId', userController.editUserAddress);

//delete an adress from a user's profile
router.delete('/api/users/:userId/adresses/:addressId', userController.deleteUserAddress);

/* -------------------- User Order Management ------------------------ */
//Retrieve list of orders a user placed
router.get('/api/users/:userId/orders', userController.getUserOrders);

//Retreive details of a closed  order for tracking purposes
router.get('/api/users/:userId/orders/:orderId/closed', userController.getClosedOrder);

//Retrieve details of an open order
router.get('/api/users/:userId/orders/:orderId/open', userController.getOpenOrder);

//Edit details of an open order
router.put('/api/users/:userId/orders/:orderId/open', userController.editOpenOrder);

//add details to an open order like new products or new shipping address
router.post('/api/users/:userId/orders/:orderId/open', userController.addToOpenOrder);

//delete an open order
router.delete('/api/users/:userId/orders/:orderId/open', userController.deleteOpenOrder);

//cancel an order
router.put('/api/users/:userId/orders/:orderId/cancel', userController.cancelOrder);

/* --------------------- User Wishlist Management---------------------------- */
//user to create  a wishlist
router.post('/api/users/:userId/wishlist', userController.createUserWishlist);

//a user to retrieve his/her  wishlist
router.get('/api/users/:userId/wishlist', userController.getUserWishlist);

//a user to add a product to their wishlist
router.post('/api/users/:userId/wishlist', userController.addToWishlist);

//a user to remove a product from their wishlist
router.delete('/api/users/:userId/wishlist/:productId', userController.removeFromWishlist);

/* ------------------------- User Review Management---------------------------- */
//a user to retrieve reviews written by a user
router.get('/api/users/:userId/reviews', userController.getUserReviews);

//user to write product reviews
router.post('/api/users/:userId/reviews', userController.writeReview);

/* ------------------ User Payment Management------------------------------ */
//user to retrieve saved payment methods
router.get('/api/users/:userId/payment-methods', userController.getUserPaymentMethods);

//user to add a new payment method
router.post('/api/users/:userId/payment-methods', userController.addPaymentMethod);

//user to remove a payment method
router.delete('/api/users/:userId/payment-methods/:paymentMethodId', userController.removePaymentMethod);







