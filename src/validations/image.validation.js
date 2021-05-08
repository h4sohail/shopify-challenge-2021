const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createImage = {
  file: Joi.object().keys({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    tags: Joi.string().default(''),
    isPrivate: Joi.boolean().default(false),
  }),
};

const getImages = {
  query: Joi.object().keys({
    name: Joi.string(),
    tags: Joi.string(),
    userId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getImage = {
  params: Joi.object().keys({
    imageId: Joi.string().custom(objectId),
  }),
};

const updateImage = {
  params: Joi.object().keys({
    imageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      tags: Joi.string(),
    })
    .min(1),
};

const deleteImage = {
  params: Joi.object().keys({
    imageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createImage,
  getImages,
  getImage,
  updateImage,
  deleteImage,
};
