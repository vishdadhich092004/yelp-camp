const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync.js");
const { validateReview, isReviewAuthor, isLoggedIn } = require('../middleware.js');
const reviews = require('../controllers/reviews.js');

// Reviews Post request from Show page
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createNewReview))

// Delete Review request
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;