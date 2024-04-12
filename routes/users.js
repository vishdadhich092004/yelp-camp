const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister) // renders the register page
    .post(catchAsync(users.register)); // post request for new user

router.route('/login')
    .get(users.renderLogin) // renders login page
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), catchAsync(users.login)); // logins the user 

router.get('/logout', users.logout);

module.exports = router;
