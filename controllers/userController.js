// const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const Address = require('../models/address');
const Order = require('../models/order');
const Review = require('../models/review');
const PaymentMethod = require('../models/payment');

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

// exports.login = async (req, res) => {
//   console.log('Currently in login');
//   await res.status(200).json({ message: 'Endpoint reached'});
// };

// exports.login = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     console.log(username, password);

//     const user = await User.findByUsername(username);
//     if(!user) {
//       res.json({ message: 'PLease sign up' });
//     }
//     res.json({message: 'Logged in succesfully', user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Problem with this endpoint' });
//   }
// };

exports.signup = async (req, res) => {
  /* Check for validation errors
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array() });
	} */
  console.log('Currently in signup');
  try {
    // Create a new user with the trusted sanitized data in the req.body
    const { username, email, password } = req.body;
    console.log(username, email, password);

    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();
    /*
    newUser.save(function (err) {
      if (err) {
          throw err;
      } else {
        res.status(201).json(newUser);
      }
  }); */
    console.log('*****');
    console.log(username, email, password);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.login = async (req, res) => {
  try {
  console.log('Currently in login'); // Add this line to log that the login function is being executed

  // Check if user authentication was successful
  if (req.isAuthenticated()) {
    console.log('Authentication successful'); // Log that authentication was successful
    console.log('User:', req.user); // Log the user object obtained from authentication
    console.log(res);
    await res.json({ message: 'Login Successful', user: req.user });
  } else {
    console.log('Authentication failed'); // Log that authentication failed
    res.status(401).json({ message: 'Login Failed' });
  }
} catch (error) {
  console.log(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
};



exports.logout = async (req, res) => {
  if (req.isAuthenticated()) {
    console.log('In logout');
    req.logout(async function (err) {
    if (err) { return (err); }
    const clearedCookie = await res.clearCookie('sessionID'); // Clear the session cookie
    if (!clearedCookie) { return res.json({ message: 'Internal Server Error' }) }
    console.log('clearedCookie: ', clearedCookie);
    return res.json({ message: 'Logout successful' })
    }); // Logout the user
    
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

/* Function that sends a reset password email t the user with a unique
token/link to reset password */

exports.forgotPassword = async (req, res) => {
  try {
    // Generate unique reset token
    const resetToken = crypto.randomBytes(15).toString('hex');

    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the reset token and expiration time in the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 1800000; // Token expires in 1hour

    // save the user record with the reset token
    await user.save();

    // send reset email to user
    const transporter = nodemailer.createTransport({
      // configure mail service here; Gmail or Sendgrid
    });

    const mailOptions = {
      to: user.email,
      from: 'support@buzzbasket.com',
      text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
      + `${req.headers.origin}/reset/${resetToken}\n\n`
      + 'If you did not request this, please ignore this email, and your password will remain unchanged.\n',

    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Email sending failed' });
      }
      return res.status(200).json({ message: 'Password reset email sent' });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
  return null;
};

/* When users click the link in the email they should be taken to a
page where they can enter a new password. Nb: the link in the email contains
the token also the link is the url req passed to the resetUserPassword */
exports.resetUserPassword = async (req, res) => {
  const resetToken = req.params.token; // Assuming the token is in the URL
  const { newPassword } = req.body; // Asuuming the new password is submitted in the request body

  try {
    // find user by reset token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check token expiration
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update the users's password
    user.password = newPassword;
    user.resetPasswordToken = undefined; // clear reset token
    user.resetPasswordExpires = undefined; // clear the expiration tume

    // save the updated user record
    await user.save();

    // respond with a success message
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // extract the relevant user profile data
    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      address: user.address,
    };

    return res.json(userProfile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // assuming userid deh the request parameter

    const updatedProfileData = req.body; // as long as new profile info deh the put request

    // Use Mongoose to find the user by their ID and update their profile data
    const user = await User.findByIdAndUpdate(userId, updatedProfileData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Profile updated successfully', user: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const newPassword = req.body;

    const user = await User.findByIdAndUpdate(userId, { password: newPassword }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Password updated successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server error' });
  }
};
exports.getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('addresses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract user's addresses from the populated field
    const userAddresses = user.addresses;

    return res.json(userAddresses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserAddress = async (req, res) => {
  try {
    const { userId, addressIndex } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
       return res.status(404).json({ message: 'Address not found' })
    }
    // Extraxt user's address data
    const userAddress = {
      street: user.addresses[addressIndex].street,
      city: user.addresses[addressIndex].city,
      state: user.addresses[addressIndex].state,
      postalcode: user.addresses[addressIndex].postalcode,
      country: user.addresses[addressIndex].country,
    };

    return res.json(userAddress);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addNewAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const newAddressData = req.body;
    const newAddress = new Address(newAddressData);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add new address to the user's adress array
    user.address.push(newAddress);

    await user.save();

    return res.json({ message: 'Address added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server error' });
  }
};

exports.editUserAddress = async (req, res) => {
  try {
    const { userId } = req.params;

    const newAddress = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the address
    user.address.street = newAddress.street;
    user.address.city = newAddress.city;
    user.address.state = newAddress.state;
    user.address.postalCode = newAddress.postalCode;
    user.address.country = newAddress.country;

    await user.save();

    return res.json({ message: 'Address updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteUserAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { addressId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressToDelete = user.addresses.id(addressId);

    if (!addressToDelete) {
      return res.status(404).json({ message: 'Address not found' });
    }

    addressToDelete.remove();

    await user.save();
    return res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findbyId(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const userOrder = await Order.findById(user.order);

    // Extract user order
    const userOrder = {
      products: user.Order.products,
      totalAmount: user.Order.totalAmount,
      orderDate: user.Order.orderDate,
      shippingDetails: user.Order.shippingDetails,
      payment: user.Order.payment,
    };
	   return res.json(userOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getClosedOrder = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { orderId } = req.params;

    const closedOrder = await Order.findOne({ _id: orderId, isClosed: true });

    if (!closedOrder) {
      return res.status(404).json({ message: 'Closed order not found' });
    }

    return res.json(closedOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getOpenOrder = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { orderId } = req.params;

    const openOrder = await Order.findOne({ _id: orderId, isClosed: false });

    if (!openOrder) {
      return res.status(404).json({ message: 'Open order not found' });
    }
    return res.json(openOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.editOpenOrder = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { orderId } = req.params;
    const updatedOrderData = req.body;

    const openOrder = await Order.findOne({ _id: orderId, isclosed: false });

    if (!openOrder) {
      return res.status(404).json({ message: 'Open Order not found' });
    }

    openOrder.products = updatedOrderData.products;
    openOrder.shippingDetails = updatedOrderData.shippingDetails;
    openOrder.payment = updatedOrderData.payment;

    await openOrder.save();

    return res.json(openOrder);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addToOPenOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { orderId } = req.params;
    const productToAdd = req.body;

    const openOrder = await Order.findOne({ _id: orderId, isclosed: false });

    if (!openOrder) {
      // Create a new open order if it doesnt exist
      const newOpenOrder = new Order({
        userId,
        isclosed: false,
        products: productToAdd,

      });
      await newOpenOrder.save();
    } else {
      // Add product to existing open order
      openOrder.products.push(productToAdd);
      await openOrder.save();
    }

    res.status(200).json({ message: 'Product added to open order successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteOpenOrder = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { orderId } = req.params;

    const openOrder = await Order.findOne({ _id: orderId, isclosed: false });

    if (!openOrder) {
      return res.status(404).json({ message: 'Open order not found' });
    }

    await openOrder.remove();

    return res.status(200).json({ message: 'Open order deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    // const { userId } = req.params;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.cancelled === true) {
      return res.status(400).json({ message: 'Order is already canceled' });
    }

    order.cancelled = true;

    await order.save();

    return res.status(200).json({ message: 'Order canceled successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { wishlistItems } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist.push(...wishlistItems);

    await user.save();

    res.status(201).json({ message: 'Wishlist created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { wishlist } = user;

    res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product already exists in the wishlist
    const isProductInWishlist = user.wishlist.includes(productId);

    if (isProductInWishlist) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add the productId to the user's wishlist
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product exists in the wishlist
    const productIndex = user.wishlist.indexOf(productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    // Remove the productId from the user's wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find reviews associated with the user
    const reviews = await Review.find({ userId });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.writeReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, rating, reviewText } = req.body;

    // Create a new review
    const newReview = new Review({
      userId,
      productId,
      rating,
      reviewText,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserPaymentMethods = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user's payment methods from the database
    const paymentMethods = await PaymentMethod.find({ userId });

    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addPaymentMethod = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      paymentType, cardNumber, expirationDate, billingAddress,
    } = req.body;

    // Create a new payment method
    const newPaymentMethod = new PaymentMethod({
      userId,
      paymentType,
      cardNumber,
      expirationDate,
      billingAddress,
    });

    // Save the payment method to the database
    await newPaymentMethod.save();

    res.status(201).json({ message: 'Payment method added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.removePaymentMethod = async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.params;

    // Find the payment method by its ID and associated user ID
    const paymentMethod = await PaymentMethod.findOneAndDelete({
      _id: paymentMethodId,
      userId,
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};