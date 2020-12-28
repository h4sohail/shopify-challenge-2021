const express = require('express');

const router = express.Router();
const formidable = require('formidable');
const crypto = require('crypto');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Image model
const Image = require('../models/Image');


// TO-DO: deal with zip uploads
// Upload Image
router.post('/upload', ensureAuthenticated, (req, res) => {
	let errors = [];
	const user = req.user;

	options = {
		multiples: true,
		keepExtensions: true,
		maxFileSize: 15 * 1024 * 1024, // 15mb
		maxFields: 2,
		maxFieldsSize: 1 * 1024 * 1024 // 1mb
	}

    const form = new formidable.IncomingForm(options);

    form.parse(req, (err, fields, files) => {});

	const newImage = new Image();

	form.on('field', (name, field) => {
		if (name == 'visibility' && field == 'private') {
			newImage.private = true;
		} else {
			newImage.private = false;
		}
	});

	// hash the file name
    form.on('fileBegin', (name, file) => {
		if (!file) {
			errors.push({ msg: 'Please select a file or a .zip archive' });
			return;
		}
		
		const fileType = file.type.split('/').pop();

		if (!fileTypeValidator(fileType)) {
			errors.push({ msg: 'Only allowed file extensions are: jpg, jpeg, png or gif' });
			return;
		}

		newImage.user = user;
		newImage.author = user.name;
		newImage.name =  file.name;

		file.name = crypto.randomBytes(32).toString('hex') + '.' + fileType;
		file.path = './uploads/' + file.name;
		
		newImage.storage = file.path;
		newImage.save();

	});

	if (errors.length == 0) {
		form.on('file', (name, file) => {
			console.log(user.name + ' uploaded ' + file.name);
			// to-do: add this to a log file
		});
		res.redirect('../../dashboard');
	} else {	
		Image.find({user: req.user}, (err, images) => {
			res.render('dashboard', {
				user: req.user, 
				userImages: images,
				errors: errors
			});
		});
	}
});

router.post('/download', ensureAuthenticated, (req, res) => {
	const image = req.image;
	Image.findById({id: image}, (err, image) => {
		if (image.user === req.user) {
			res.download(image.storage);
		}
	});
});

// Delete
router.post('/delete', ensureAuthenticated, (req, res) => {
    const images = req.images;
    const user = req.user;
    let errors = [];

    if (!images) {
      errors.push({ msg: 'Please select image(s) to delete' });
    }
	
	// to-do: check if user owns the images
  
	// to-do: remove the images from DB, add them to a queue to be deleted from filesystem

});


const fileTypeValidator = fileType => {
	return fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif'
}

module.exports = router;