const { Image } = require('../../../src/models');

describe('Image model', () => {
  describe('Image validation', () => {
    let newImage;
    beforeEach(() => {
      newImage = {
        name: 'fake image',
        tags: ['this', 'is', 'a', 'tag'],
        isPrivate: false,
        user: '67083477606ea2d0980b526c',
        originalname: 'image.jpeg',
        path: 'uploads/image.jpeg',
        size: 123456,
      };
    });

    test('should correctly validate a valid image', async () => {
      await expect(new Image(newImage).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if name is missing', async () => {
      delete newImage.name;
      await expect(new Image(newImage).validate()).rejects.toThrow();
    });

    test('should throw a validation error if user is missing', async () => {
      delete newImage.user;
      await expect(new Image(newImage).validate()).rejects.toThrow();
    });

    test('should throw a validation error if originalname is missing', async () => {
      delete newImage.originalname;
      await expect(new Image(newImage).validate()).rejects.toThrow();
    });
    test('should throw a validation error if path is missing', async () => {
      delete newImage.path;
      await expect(new Image(newImage).validate()).rejects.toThrow();
    });

    test('should throw a validation error if size is missing', async () => {
      delete newImage.size;
      await expect(new Image(newImage).validate()).rejects.toThrow();
    });
  });

  describe('Image toJSON()', () => {
    test('should not return path when toJSON is called', () => {
      const newImage = {
        name: 'fake image',
        tags: ['this', 'is', 'a', 'tag'],
        isPrivate: false,
        user: '67083477606ea2d0980b526c',
        originalname: 'image.jpeg',
        path: 'uploads/image.jpeg',
        size: 123456,
      };
      expect(new Image(newImage).toJSON()).not.toHaveProperty('password');
    });
  });
});
