const express = require('express')
const router = express.router();
const passport = require(passport);
const LocalStrategy = require('passport-loacl').Strategy;

//Middleware for validation and sanitization of user input data
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

//import the User model
const User = require('../models/user');

//Middleware function to check if the user has admin privileges
function isAdmin(req, res, next) {
	if (req.user && req.user.isAdmin) {
		//User has admin privileges, allow access to the next middleware
		next()
	} else {
		//User does not have admin privileges, deny access
		res.status(403).json({error: 'Permission denied'});
	}
}

//Define /users route and apply the isAdmin middleware
router.get('/api/users', isAdmin, async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal Server Error'});
	}
});

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


/* ------------------User Registration and Authentication--------------------- */
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

// Route for authentication and  login
router.post('/api/users/login', passport.authenticate('local'), (req, res) => {
	res.json({message: 'Login Successful', user: req.user});
});

// Route for currently  authenticated user to logout
router.post('/api/users/logout', () => {});

// Route for initiating the forgotten-password process
router.post('/api/users/forgot-password', () => {});

// Route to reset a user's password after receiving a reset token
router.post('/api/users/reset-password', () => {});

//Route for a user to retrieve his/her own profile info
router.get('/api/users/me', () => {});


/* ----------------User Profile Management-------------------- */
// Retrieve profile of a specific user by their user ID.
router.get('/api/users/:userId', () => {});

//Update/edit a user's profile information.
router.put('/api/users/:userId', () => {});

//Allow users to change password.
router.put('/api/users/:userId', () => {});


/* -----------------Address Managment--------------------- */
//Retrieve a list of addresses associated with a user
router.get('/api/users/:userId/addresses', () => {});

//add new address to a user's profile
router.post('/api/users/:userId/addresses', () => {});

//update/edit a user's address
router.put('/api/users/:userId/addresses/:addressId', () => {});

//delete an adress from a user's profile
router.delete('/api/users/:userId/adresses/:addressId', () => {});

/* --------------------Order History ------------------------ */
//Retrieve list of orders a user placed
router.get('/api/users/:userId/orders', () => {});

//Retreive details of a specific order
router.get('/api/users/:userId/orders/:orderId', () => {});

/* ---------------------Wishlist---------------------------- */
// REtrieve a user's wishlist
