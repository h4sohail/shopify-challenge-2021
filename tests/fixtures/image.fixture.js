const mongoose = require('mongoose');
const fs = require('fs');
const Image = require('../../src/models/image.model');
const { userOne, userTwo } = require('./user.fixture');

const imageOne = {
  _id: mongoose.Types.ObjectId(),
  tags: ['fake', 'superFake', 'image'],
  isPrivate: false,
  originalname: 'imageFixtureOne.jpeg',
  path: 'uploads/3a9e6d5eb8821b0abc31b04324a9ce6cb9bf6430.jpeg',
  size: 254708,
  name: 'fakeimage one',
  user: userOne._id,
};

const imageTwo = {
  _id: mongoose.Types.ObjectId(),
  tags: [''],
  isPrivate: false,
  originalname: 'imageFixtureTwo.jpeg',
  path: 'uploads/3b8e6d5eb8821d0abc31b04324a9ce6cb9bf6456.jpeg',
  size: 254708,
  name: 'fakeimage two',
  user: userTwo._id,
};

const insertImages = async (images) => {
  await Image.insertMany(images);
};

module.exports = {
  imageOne,
  imageTwo,
  insertImages,
};
