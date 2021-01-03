const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  user: {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'User',
    required: true
  },
  author: {
	  type: String,
	  required: true
  },
  name: {
    type: String,
    required: true
  },
  private: {
	  type: Boolean,
	  default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  storage: {
    type: String,
    required: true
  },
  download: {
	  type: String,
	  required: true
  }
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;