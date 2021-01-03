const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');

const { ensureAuthenticated } = require('../config/auth');
const { getBaseAppURL, API_URL } = require('../config/constants');
const Image = require('../models/Image');

// Multer storage
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './uploads');
	},
	filename: (req, file, callback) => {
		callback(null, crypto.randomBytes(32).toString('hex') + path.extname(file.originalname));
	}
});

// Multer file filter
const fileFilter = (req, file, cb) => {
	const fileType = file.mimetype;
    if (fileType == 'image/jpg' || fileType == 'image/gif' || fileType == 'image/jpeg' || fileType == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ 
	storage: storage, 
	fileFilter: fileFilter, 
	limits: { fileSize: 15 * 1024 * 1024, fieldSize: 1024 }
}).array('upload', 10);

const renderDashboard = (req, res, errors) => {
	return Image.find({user: req.user}, (err, images) => {
		res.render('dashboard', {
			errors,
			user: req.user, 
			userImages: images
		});
	});
}

router.post('/upload', ensureAuthenticated, (req, res) => {
	upload(req, res, err => {
		let errors = [];

		const user = req.user; 
		const files = req.files;
		const isPrivate = req.body.visibility == 'private';
		
        if (err) {
			errors.push({ error: 'Error uploading file!' });
			renderDashboard(req, res, errors);
		}

		files.forEach(file => {
			const newImage = new Image();

			if (errors.length == 0) {
				newImage.user = user;
				newImage.author = user.name;
				newImage.name =  file.originalname;
				newImage.private = isPrivate;
				newImage.storage = file.path;
				newImage.download = `${getBaseAppURL()}/${API_URL}/download/${newImage._id}`;
				newImage.save();
			}
		});
		res.redirect('../../dashboard')
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
		}

		if (image.private) {
			if (image.user._id != user.id) {
				errors.push({ msg: 'You are not authorized!' });
				renderDashboard(req, res, errors);
			}
		}

		res.status(200);
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
		}
		
		if (image.user._id != user.id) {
			errors.push({ msg: 'You are not authorized!' });
			renderDashboard(req, res, errors);
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
				res.status(200).send('SUCCESS: File deleted');
			});
		}
	});
});

module.exports = router;