const express = require('express');
const router = express.Router();

const userRoute = require('./userRoute');
const productRoute = require('./productRoute');
const orderRoute = require('./orderRoute');
const wishlistRoute = require('./wishlistRoute');
const addressRoute = require('./addressRoute');
const paymentRoute = require('./paymentRoute');
const reviewRoute = require('./reviewRoute');
const imageRoute = require('./imageRoute');
const categoryRoute = require('./categoryRoute');

router.use('/users', userRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);
router.use('/wishlist', wishlistRoute);
router.use('/address', addressRoute);
router.use('/payment', paymentRoute);
router.use('/review', reviewRoute);
router.use('/image', imageRoute);
router.use('/category', categoryRoute);

module.exports = router;
