const httpStatus = require('http-status');
const multer = require('multer');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');

const multerFilter = (req, file, next) => {
  if (file.mimetype.startsWith('image')) {
    next(null, true);
  } else {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Only image files are allowed'));
  }
};

const multerStorage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, 'uploads');
  },
  filename: (req, file, next) => {
    const ext = file.mimetype.split('/')[1];
    const hash = crypto.randomBytes(20).toString('hex');
    next(null, `${hash}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single('file');

module.exports = {
  upload,
};
