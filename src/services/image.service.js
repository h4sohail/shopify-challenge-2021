const httpStatus = require('http-status');
const { Image } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a image
 * @param {Object} file
 * @param {Object} fields
 * @returns {Promise<Image>}
 */
const createImage = async (file, fields) => {
  if (file.size > 5 * 1024 * 1024) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File must be less than 5mb');
  }
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
  }
  if (!fields.name) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name is required');
  }
  const imageBody = { ...file, ...fields };
  const image = await Image.create(imageBody);
  return image;
};

/**
 * Query for images
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryImages = async (filter, options) => {
  let newFilter = {};
  if (filter.name || filter.tags || filter.userId) {
    newFilter = {
      $or: [{ name: { $regex: `${filter.name}`, $options: 'i' } }, { tags: filter.tags }, { userId: filter.userId }],
    };
  }
  let images;
  if (newFilter !== {}) {
    images = await Image.paginate(newFilter, options);
  } else {
    images = await Image.paginate(filter, options);
  }
  images.results = images.results.filter((image) => !image.isPrivate);
  return images;
};

/**
 * Get image by id
 * @param {ObjectId} id
 * @returns {Promise<Image>}
 */
const getImageById = async (id) => {
  return Image.findById(id);
};

/**
 * Update image by id
 * @param {ObjectId} imageId
 * @param {Object} updateBody
 * @returns {Promise<Image>}
 */
const updateImageById = async (imageId, updateBody) => {
  const image = await getImageById(imageId);
  if (!image) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  if (updateBody.email && (await Image.isEmailTaken(updateBody.email, imageId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(image, updateBody);
  await image.save();
  return image;
};

/**
 * Delete image by id
 * @param {ObjectId} imageId
 * @returns {Promise<Image>}
 */
const deleteImageById = async (imageId) => {
  const image = await getImageById(imageId);
  if (!image) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  await image.remove();
  return image;
};

module.exports = {
  createImage,
  queryImages,
  getImageById,
  updateImageById,
  deleteImageById,
};
