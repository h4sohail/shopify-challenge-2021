const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const crypto = require('crypto');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Stock model
const Image = require('../models/Image');

// Load User model
const User = require('../models/User');

// TO-DO: deal with zip uploads
// Upload Image
router.post('/upload', ensureAuthenticated, (req, res) => {
	let errors = [];
	const user = req.user;
	
    var form = new formidable.IncomingForm();

    form.parse(req);

	// hash the file name
    form.on('fileBegin', (name, file) => {
		if (!file) {
			errors.push({ msg: 'Please select a file or a .zip archive' });
			return;
		}

		const ext = getExt(file.name);

		if (!validator(ext)) {
			errors.push({ msg: 'Only allowed file extensions are: jpg, jpeg, png, gif or zip' });
			return;
		}

		const newImage = new Image();
		newImage.user = user;
		newImage.author = user.name;
		newImage.name =  file.name;

		file.name = crypto.randomBytes(32).toString('hex') + ext;
		file.path = './uploads/' + file.name;
		
		newImage.storage = file.path;
		newImage.save();
    });

    form.on('file', (name, file) => {
		console.log('Uploaded ' + file.name);
    });
	
	res.redirect('../dashboard');

    // if (!image) {
    //   errors.push({ msg: 'Please select an image' });
    // }
	
	// // check image extension
	
	// // check image size
  
    // if (errors.length > 0) {
    //   res.render('dashboard', {
	// 	user: user,
	// 	errors
    //   });
    // } else {
    //     // add image to local filesystem and update the DB
    // }
});

// Delete
router.post('/delete', ensureAuthenticated, (req, res) => {
    const images = req.images;
    const user = req.user;
    let errors = [];
    
    // check if amount exceeds User's current balance

    if (!images) {
      errors.push({ msg: 'Please select image(s) to delete' });
    }
	
	// check if user owns the images
  
    if (errors.length > 0) {
      res.render('dashboard', {
		user: user,
        errors
      });
    } else {
        // remove the images from DB, add them to a queue to be deleted from local file system
    }
});

const getExt = filename => {
	let ext = filename.substr(filename.length - 5);
	if (ext === ".jpeg") {
		return ext;
	} 
	ext = filename.substr(filename.length - 4);
	return ext;
}

const validator = ext => {
	return ext === ".zip" || ext === ".jpg" || ext === ".png" || ext == "jpeg" || ext === ".gif"
}

module.exports = router;