const express = require('express');
const fs = require('fs');
const router = express.Router();
const formidable = require('formidable');
const crypto = require('crypto');

const { ensureAuthenticated } = require('../config/auth');
const { getBaseAppURL, API_URL } = require('../config/constants');
const Image = require('../models/Image');

router.post('/upload', ensureAuthenticated, (req, res) => {
	const user = req.user;

	options = {
		//multiples: true,
		keepExtensions: true,
		maxFileSize: 15 * 1024 * 1024, // 15mb
		maxFields: 2,
		maxFieldsSize: 1 * 1024 * 1024 // 1mb
	}

	const newImage = new Image();
	const form = new formidable.IncomingForm(options);
	
    form.parse(req);
	
	form.on('field', (name, field) => {
		if (name == 'visibility' && field == 'private') {
			newImage.private = true;
		} else {
			newImage.private = false;
		}
	});

	// hash the file name and save it
    form.on('fileBegin', (name, file) => {
		let errors = [];

		if (file.name == '' || !file) {
			errors.push({ msg: 'No image(s) selected!' });
			renderDashboard(req, res, errors);
			return;
		}
		
		const fileType = file.type.split('/').pop().trim();

		if (!fileTypeValidator(fileType)) {
			errors.push({ msg: 'Unsupported file format!' });
			renderDashboard(req, res, errors);
			return;
		}

		if (errors.length == 0) {
			newImage.user = user;
			newImage.author = user.name;
			newImage.name =  file.name;
	
			file.name = crypto.randomBytes(32).toString('hex') + '.' + fileType;
			file.path = process.cwd() + '/uploads/' + file.name;
			
			newImage.storage = file.path;
			newImage.download = `${getBaseAppURL()}/${API_URL}/download/${newImage._id}`;

			newImage.save();
			
			res.redirect('../../dashboard');
		}
	});	
});

// Download
router.get('/download/:id', ensureAuthenticated, (req, res) => {
	const user = req.user;
	const id = req.params.id;

	Image.findById(id, (err, image) => {
		let errors = []

		if (!image) {
			errors.push({ msg: 'No image(s) selected!' });
			renderDashboard(req, res, errors);
			return;
		}

		if (image.private) {
			errors.push({ msg: 'You are not authorized!' });
			renderDashboard(req, res, errors);
			return;
		}
		res.download(image.storage, image.name);
	})
});

// Delete
router.post('/delete/:id', ensureAuthenticated, (req, res) => {
	const user = req.user
	const id = req.params.id;
	
	Image.findById(id, (err, image) => {
		let errors = [];

		if (!image) {
			errors.push({ msg: 'No image(s) selected!' });
			renderDashboard(req, res, errors);
			return;
		}
		
		if (image.user._id != user.id) {
			errors.push({ msg: 'You are not authorized!' });
			renderDashboard(req, res, errors);
			return;
		}
	
		const path = image.storage;

		if (errors.length == 0) {
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
});


const fileTypeValidator = fileType => {
	return fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'gif'
}

const renderDashboard = (req, res, errors) => {
	Image.find({user: req.user}, (err, images) => {
		res.render('dashboard', {
			errors,
			user: req.user, 
			userImages: images
		});
	});
}

module.exports = router;