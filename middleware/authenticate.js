const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// Middleware function to validate user input data during registration
// Note that its made up of an array of validation functions
exports.validateUserInput = [
	body('email').isEmail().normalizeEmail(),
	body('password').isLength({min: 6, max: 15}),
	//i'll add more validation rules later
];

//Middleware function to sanitize user input to prevent XSS
exports.sanitizeUserData = function(req, res, next) {
	//remove harmful html/js
	req.body.email = sanitizeHtml(req.body.email);
	req.body.username = sanitizeHtml(req.body.username);
	req.body.password = sanitizeHtml(req.body.password);
	req.body.fullname = sanitizeHtml(req.body.fullname);
}