const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds.js');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index)) // Index All Campground
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))  // post request for the new campground

// New camp get request
router.get("/new", isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground)) // Show details of each camp
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) //Push the changes thru put
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) //Delete the campground

// Load Edit page
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
