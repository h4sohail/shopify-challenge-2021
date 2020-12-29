const express = require('express');

const fs = require('fs');
const router = express.Router();
const formidable = require('formidable');
const crypto = require('crypto');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Load Image model
const Image = require('../models/Image');


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
			res.status(400).send('Please select a file!');
		}
		
		const fileType = file.type.split('/').pop().trim();

		if (!fileTypeValidator(fileType)) {
			errors.push({ msg: 'Only allowed file extensions are: jpg, jpeg, png or gif' });
			res.status(400).send('Unsupported file format!');
		}

		newImage.user = user;
		newImage.author = user.name;
		newImage.name =  file.name;

		file.name = crypto.randomBytes(32).toString('hex') + '.' + fileType;
		file.path = process.cwd() + '/uploads/' + file.name;
		
		newImage.storage = file.path;
		newImage.save();
		
	});

	res.redirect('../../dashboard');
	
	if (errors.length != 0) {
		renderDashboard(res, req, errors);
	}
});

// Download
router.get('/download/:id', ensureAuthenticated, (req, res) => {
	let errors = [];

	const user = req.user;
	const id = req.params.id;

	Image.findById(id, (err, image) => {
		if (!image) {
			return;
		}

		if (image.user._id == user.id) {
			res.download(image.storage, image.name);
		}
	})

	if (errors.length != 0) {
		renderDashboard(res, req, errors);
	}
});

// Delete
router.post('/delete/:id', ensureAuthenticated, (req, res) => {
	let errors = [];

	const user = req.user
	const id = req.params.id;
	
	Image.findById(id, (err, image) => {
		if (!image) {
			return;
		}
		
		if (image.user._id == user.id) {
			const path = image.storage;
			// check if file exists on filesystem and delete it
			if (fs.existsSync(path)){
				fs.unlink(path, (err) => {
					if (err) {
						console.error(err);
						return;
					}
				});	
			}

			Image.findByIdAndDelete(id, () => {
				res.status(200).send('OK');
			});
		}
	});

	if (errors.length != 0) {
		renderDashboard(res, req, errors);
	}
});


const fileTypeValidator = fileType => {
	return fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif'
}

const renderDashboard = (res, req, errors) => {
	Image.find({user: req.user}, (err, images) => {
		res.render('dashboard', {
			user: req.user, 
			userImages: images,
			errors: errors
		});
	  });
}

module.exports = router;