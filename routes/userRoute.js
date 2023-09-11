const express = require('express')
const router = express.router();

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
router.get('/users', isAdmin, async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal Server Error'});
	}
});

//router.post
