const express = require('express');
const passport = require('passport');
//const { testRoute } = require('../controllers/newFile');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const addressController = require('../controllers/addressController');
//const paymentController = require('../controllers/paymentController');
const shippingController = require('../controllers/shippingController');
//const imageController = require('../controllers/imageController');
const categoryController = require('../controllers/categoryController');
const cartController = require('../controllers/cartController');
const router = express.Router();
const authenticate = require('../middleware/authenticate');



//router.post('/api/status', userController.testRoute);

/* ------------------- User Registration/Signup --------------------- */
//router.post('/api/users/signup', authenticate.validateUserInput, authenticate.sanitizeUserData, userController.signup);
router.post('/api/users/signup', userController.signup);

/* -------------------- User Authentication and Login ---------------- */
router.post('/api/users/login', passport.authenticate('local'), userController.login);
router.post('/api/users/logout', passport.authenticate('local'), userController.logout);
router.post('/api/users/forgot-password', userController.forgotPassword);
router.post('/api/users/reset-password', userController.resetUserPassword);

/*------------------- User Profile Management --------------------*/
router.get('/api/users/:userId', userController.getUserProfile);
router.put('/api/users/:userId', userController.updateUserProfile);
router.put('/api/users/:userId', userController.changeUserPassword);


/* -------------------- User Address Management ----------------- */
router.get('/api/users/:userId/addresses', userController.getUserAddresses);
router.get('/api/users/:userId/addresses/:addressIndex', userController.getUserAddress);
router.put('/api/users/:userId/addresses', userController.addNewAddress);
router.put('/api/users/:userId/addresses/:addressId', userController.editUserAddress);
router.delete('/api/users/:userId/adresses/:addressId', userController.deleteUserAddress);


/* ------------------ User Order Management -------------------------*/
router.get('/api/users/:userId/orders', userController.getUserOrders);
router.get('/api/users/:userId/orders/:orderId/closed', userController.getClosedOrder);
router.get('/api/users/:userId/orders/:orderId/open', userController.getOpenOrder);
router.put('/api/users/:userId/orders/:orderId/open', userController.editOpenOrder);
router.post('/api/users/:userId/orders/:orderId/open', userController.addToOPenOrder);
router.delete('/api/users/:userId/orders/:orderId/open', userController.deleteOpenOrder);
router.put('/api/users/:userId/orders/:orderId/cancel', userController.cancelOrder);

/* ------------------ User Wishlist Management ------------------- */
router.post('/api/users/:userId/wishlist', userController.createUserWishlist);
router.get('/api/users/:userId/wishlist', userController.getUserWishlist);
router.post('/api/users/:userId/wishlist', userController.addToWishlist);
router.delete('/api/users/:userId/wishlist/:productId', userController.removeFromWishlist);

/* ------------------------- User Review Management---------------------------- */
router.get('/api/users/:userId/reviews', userController.getUserReviews);
router.post('/api/users/:userId/reviews', userController.writeReview);

/* ------------------ User Payment Management------------------------------ */
router.get('/api/users/:userId/payment-methods', userController.getUserPaymentMethods);
router.post('/api/users/:userId/payment-methods', userController.addPaymentMethod);
router.delete('/api/users/:userId/payment-methods/:paymentMethodId', userController.removePaymentMethod);


/* -------------- Product Management --------------------------------------- */
router.get('/api/products', productController.getProducts);
router.post('/api/products', productController.createProduct);
router.get('/api/products/:productId', productController.getProductById);
router.put('/api/products/:productId', productController.updateProduct);
router.delete('/api/products/:productId', productController.deleteProduct);
router.get('/api/products/search', productController.searchProducts);
router.get('/api/products/categories', productController.getCategories);
router.post('/api/products/:productId/reviews', productController.createProductReview);
router.post('/api/products/:productId/images', productController.uploadProductImages);
router.post('/api/products/import', productController.importProducts);
router.get('/api/products/recommendations', productController.getProductRecommendations);
router.put('/api/products/:productId/inventory', productController.updateProductInventory);


/* --------------- Payment Management ----------------------------- */
/*
router.get('/api/payments', paymentController.getPaymentTxns);
router.get('/api/payments/:paymentId',paymentController.getPaymentTxnById);
router.post('/api/payments/process', paymentController.processPayments);
router.post('/api/payments/capture/:paymentId', paymentController.capturePayment);
router.post('/api/payments/refund/:paymentId', paymentController.refundPayment);
router.post('/api/payments/cancel/:paymentId', paymentController.cancelPayment);
router.post('/api/payment-gateways', paymentController.configurePaymentGateway);
router.post('/api/payment-gateways/callback', paymentController.handleGatewayCallback);
router.get('/api/payments/history', paymentController.getPaymentHistory);
router.get('/api/payments/report', paymentController.generatePaymentReports);
router.get('/api/payment-settings', paymentController.getPaymentSettings);
router.put('/api/payment-settings/:gatewayId', paymentController.configureGatewaySettings);
router.post('/api/payments/fraud-detection', paymentController.configureFraudDetection);
router.get('/api/payments/fraud-alerts', paymentController.manageFraudAlerts);
router.post('/api/payments/subscriptions', paymentController.manageSubscriptions);
router.post('/api/payments/recurring', paymentController.handleRecurringPayments);
router.get('/api/payments/failed', paymentController.manageFailedPayments);
router.post('/api/payments/disputes', paymentController.handlePaymentDisputes);
router.get('/api/payments/dashboard', paymentController.getFinancialDashboard);
router.get('/api/payment-integration', paymentController.providePaymentIntegration);
router.get('/api/exchange-rates', paymentController.manageExchangeRates);
*/

/* --------------------- Order Management ------------------------ */
router.post('/api/orders', orderController.createOrder);
router.get('/api/orders', orderController.getAllOrders);
router.get('/api/orders/:orderId', orderController.getOrderById);
router.put('/api/orders/:orderId/status', orderController.updateOrderStatus);
router.post('/api/orders/:orderId/items', orderController.addOrderItems);
router.put('/api/orders/:orderId/items/:itemId', orderController.updateOrderItem);
router.delete('/api/orders/:orderId/items/:itemId', orderController.removeOrderItem);
router.post('/api/orders/:orderId/checkout', orderController.checkoutOrder);
router.get('/api/orders/history', orderController.getOrderHistory);
//router.get('/api/orders/reports', orderController.generateOrderReports);
router.post('/api/orders/:orderId/cancel', orderController.cancelOrder);
router.post('/api/orders/:orderId/refund', orderController.refundOrder);
//router.post('/api/orders/notifications', orderController.configureOrderNotifications);
router.post('/api/orders/:orderId/shipping', orderController.manageOrderShipping);
router.get('/api/orders/:orderId/shipping', orderController.getOrderShippingDetails);
//router.post('/api/orders/batch', orderController.processOrderBatch);
router.post('/api/orders/:orderId/fulfill', orderController.fulfillOrder);
router.post('/api/orders/:orderId/retur', orderController.processOrderReturns);


/* ---------------------- Image Management --------------------- */
/*
router.post('/api/products/:productId/images', imageController.uploadProductImage);
router.get('/api/products/:productId/images', imageController.getProductImages);
router.get('/api/images/:imageId', imageController.getImageDetails);
router.put('/api/images/:imageId', imageController.updateImageMetadata);
router.delete('/api/images/:imageId', imageController.deleteImage);
router.put('/api/products/:productId/images/:imageId/primary', imageController.setPrimaryProductImage);
router.get('/api/users/:userId/images', imageController.getUserUploadedImages);
router.get('/api/products/:productId/images/primary', imageController.getProductPrimaryImage);
*/

/* -------------------- Address Management -------------------- */
router.post('/api/users/:userId/addresses', addressController.createAddress);
//router.get('/api/users/:userId/addresses', addressController.getUserAddresses);
router.get('/api/addresses/:addressId', addressController.getAddressById);
router.put('api/addresses/:addressId', addressController.updateAddress);
router.delete('/api/addresses/:addressId', addressController.deleteAddress);
router.put('/api/users/:userId/addresses/:addressId/default', addressController.setDefaultAddress);

/* --------------------- Shipping Management -------------------- */
router.post('/api/shipping', shippingController.createShippingMethod);
router.get('/api/shipping', shippingController.getShippingMethods);
router.get('/api/shipping/:shippingId', shippingController.getShippingMethodById);
router.put('/api/shipping/:shippingId', shippingController.updateShippingMethod);
router.delete('/api/shipping/:shippingId', shippingController.deleteShippingMethod);
router.post('/api/shipping/calculate', shippingController.calculateShippingCost);
//router.get('/api/shipping/track/:trackingNumber', shippingController.trackShipping);

/* ------------------- Category Management -------------------- */
router.post('/api/categories', categoryController.createCategory);
router.get('/api/categories', categoryController.getAllCategories);
router.get('/api/categories/:categoryId', categoryController.getCategoryById);
router.put('/api/categories/:categoryId', categoryController.updateCategory);
router.delete('/api/categories/:categoryId', categoryController.deleteCategory);

/* --------------------- Cart Management ----------------------- */
router.post('/api/cart/:userId/add', cartController.addToCart);

module.exports = router;
