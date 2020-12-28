const express = require('express');
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Image = require('../models/Image');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Image.find({user: req.user}, (err, images) => {
	res.render('dashboard', {
		user: req.user, 
		userImages: images
	});
  });
});

// repository
router.get('/repository', ensureAuthenticated, (req, res) => {
	Image.find({private: false}, (err, images) => {
	   res.render('repository', {
		   user: req.user, 
		   images: images
		});
	});
});

module.exports = router;