import express from 'express';
import User from '../models/user';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Address from '../models/address';

/* Ensure middleware for session managemnt is defined in server.js
   Because logging out from a session based authentication just requires me to destroy the session
*
exports.logoutUser = (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				return res.status(500).json({ message: 'Logout failed' });
			}
		res.clearCookie('sessionId');
		res.json({ message: 'Logout successful'});
		});
	} else {
		res.status(401).json({ message: 'Unauthorized' });
	}
};
 Passport provides a method to clear user session so the above code has been refactored below
*/
export.logoutUser = (req, res) => {
	req.logout(); //passportjs method to clear user's session
	res.clearCookie('sessionId'); //clears session cookie on the client side
};

/* Function that sends a reset password email t the user with a unique token/link to reset password */

export.forgotPassword = async (req, res) => {
	try {
		//Generate unique reset token
		const resetToken = crypto.randomBytes(15).toString('hex');

		//Find user by email
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		//Set the reset token and expiration time in the user's record
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 1800000; //Token expires in 1hour
		
		//save the user record with the reset token
		await user.save();

		//send reset email to user
		const transporter = nodemailer.createTransport({
			//configure mail service here; Gmail or Sendgrid
		});

		const mailOptions = {
			to:user.email,
			from: 'support@buzzbasket.com'
			text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${req.headers.origin}/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
		transporter.sendMail(mailOptions, (err) => {
			if (err) {
				res.status(500).json({ message: 'Email sending failed' });
			}
			res.json({ message: 'Password reset email sent' });
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	}
};

/*When users click the link in the email they should be taken to a page where they can enter a new password. Nb: the link in the email contains the token also the link is the url req passed to the resetUserPassword*/
export.resetUserPassword = async (req, res) => {
	const resetToken = req.params.token; //Assuming the token is in the URL
	const newPassword = req.body.newPassword; //Asuuming the new password is submitted in the request body
	
	try {
		//find user by reset token
		const user = await User.findOne({
			resetPasswordToken: resetToken,
			resetPasswordExpires: { $gt: Date.now() }); //Check token expiration
		});

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired reset token' });
		}
		
		//Update the users's password
		user.password = newPassword;
		user.resetPasswordToken = undefined; //clear reset token
		user.resetPasswordExpires = undefined; //clear the expiration tume
		
		//save the updated user record
		await user.save();

		//respond with a success message
		res.json({ message: 'Password reset successful' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

export.getUserProfile = async (req, res) => {
	try {
		const userId = req.params.userId;

		const user = await User.findOne(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		//extract the relevant user profile data
		const userProfile = {
			id:user._id,
			username: user.username,
			email: user.email,
			fullname: user.fullname,
			address: user.address,
		};

		res.json(userProfile);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	}
};

export.updateUserProfile = async (req, res) => {
	try {
		const userId = req.params.userId; //assuming userid deh the request parameter

		const updatedProfileData = req.body; //as long as new profile info deh the put request
		
		//Use Mongoose to find the user by their ID and update their profile data
		const user = await User.findByIdAndUpdate(userId, updatedProfileData, {new: true});
		
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({message: 'Internal Server Error' });
	}
};


export.changeUserPassword = async (req, res) => {
	try {
		const userId = req.params.userId;
		const newPassword = req.body.newPassword;

		const user = await User.findByIdAndUpdate(userId, { password: newPasswword }, {new: true});
		
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		
		res.json(user);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Internal Server error' });
	}
};

export.getUserAddress = async (req, res) => {
	try {
		const userId = req.params.userId;
		
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Extraxt user's address data
		const userAddress = {
			street: user.address.street,
			city: user.address.city,
			state: user.address.state,
			postalcode: user.address.postalcode,
			country: user.address.country,
		};

		res.json(userAddress);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

export.addNewAddress = async (req, res) => {
	try {
		const userId = req.params.userId;
		
		const newAddressData = req.body;
		const newAddress = new Address(newAddressData);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		//Add new address to the user's adress array
		user.address.push(newAddress);

		await user.save();

		res.json({ message: 'Address added successfully' });

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server error' });
	}
};

export.editUserAddress = async (req, res) => {
    try {
            const userId = req.params.userId;

            const newAddress = req.body;

            const user = await User.findById(userId);

            if (!user) {
                    return res.status(404).json({ message: 'User not found' });
            }

            //Update the address
            user.address.street = newAddress.street;
            user.address.city = newAddress.city;
            user.address.state = newAddress.state;
            user.address.postalCode = newAddress.postalCode;
            user.address.country = newAddress.country;

            await user.save();

            res.json({ message: 'Address updated successfully' });
    } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
    }
};

export.deleteUserAddress = async (req, res) => {
    try {
            const userId = req.params.userId;
            const addressId = req.params.addressId;

            const user = await User.findById(userId);

            if (!user) {
                    return res.status(404).json({ message: 'User not found' });
            }

            const addressToDelete  = user.addresses.id(addressId);

            if (!addressToDelete) {
                    return res.status(404).json({ message:'Address not found' });
            }

            addressToDelete.remove();

            await user.save();
            res.json({ message: 'Address deleted successfully' });
    } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
    }
};

export.getUserOrders = async (req, res) => {
    try {
            const userId = req.params.userId;
            const user = await User.findbyId(userId);

            if (!user) {
                    return res.status(404).json({ message: 'User not found' });
            }

            //const userOrder = await Order.findById(user.order);

            //Extract user order
            const userOrder = {
                    products: user.order.products;
                    totalAmount: user.order.totalAmount;
                    orderDate: user.order.orderDate;
                    shippingDetails: user.order.shippingDetails;
                    payment: user.order.payment;
            };              res.json(userOrder);
    } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
    }
};

export.getClosedOrder = async (req, res) => {
    try {
            const userId = req.params.userId;
            const orderId = req.params.orderId;

            const closedOrder = await order.findOne({ _id: orderId, isClosed: true });


            if(!closedOrder) {
                    return res.status(404).json({ message: 'Closed order not found' });
            }

            res.json(closedOrder);
    } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
    }
};

export.getOpenOrder = async (req, res) => {
    try {
            const userId = req.params.userId;
            const orderId = req.params.orderId;

            const openOrder = await order.findOne({_id: orderId, isClosed: false});

            if(!openOrder) {
                    return res.status(404).json({ message: 'Open order not found' });
            }
            res.json(openOrder);
    } catch (err) {
            console.error(err);
            res.status(500).json({message: 'Internal Server Error' });
    }};

export.editOpenOrder = async (req, res) => {
        try {
                const userId = req.params.userId;
                const orderId = req.params.orderId;
                const updatedOrderData = req.body;

                const openOrder = await order.findOne({_id: orderId, isclosed: false});

                if(!openOrder) {
                        return res.status(404).json({ message: 'Open Order not found' });
                }

                openOrder.products = updatedOrderData.products;
                openOrder.shippingDetails = updateOrderData.shippingDetails;
                openOrder.payment = updateOrderData.payment;

                await user.save();

                res.json(openOrder);
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal Server Error' });
        }
};


export.editOpenOrder = async (req, res) => {
    try {
            const userId = req.params.userId;
            const orderId = req.params.orderId;
            const updatedOrderData = req.body;

            const openOrder = await order.findOne({_id: orderId, isclosed: false});

            if(!openOrder) {
                    return res.status(404).json({ message: 'Open Order not found' });
            }

            openOrder.products = updatedOrderData.products;
            openOrder.shippingDetails = updateOrderData.shippingDetails;
            openOrder.payment = updateOrderData.payment;

            await user.save();

            res.json(openOrder);
    } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
    }
};