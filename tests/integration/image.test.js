/* eslint-disable security/detect-non-literal-fs-filename */
const request = require('supertest');
const httpStatus = require('http-status');
const path = require('path');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Image } = require('../../src/models');
const { admin, insertUsers, userOne } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { imageOne, imageTwo, insertImages } = require('../fixtures/image.fixture');

setupTestDB();

describe('Image routes', () => {
  describe('POST /api/v1/images', () => {
    let newImage;
    beforeEach(async () => {
      newImage = {
        name: 'my image',
        tags: 'some,tags,here',
        isPrivate: false,
      };
    });

    test('should return 201 and successfully create new image if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/api/v1/images')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Content-type', 'multipart/form-data')
        .field('name', newImage.name)
        .field('tags', newImage.tags)
        .field('isPrivate', newImage.isPrivate)
        .attach('file', path.resolve(__dirname, '../fixtures/imageFile.jpeg'))
        .expect(httpStatus.CREATED);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newImage.name,
        originalname: 'imageFile.jpeg',
        tags: newImage.tags.split(','),
        isPrivate: newImage.isPrivate,
        size: expect.anything(),
        user: expect.anything(),
      });

      const dbImage = await Image.findById(res.body.id);
      expect(dbImage).toBeDefined();
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/api/v1/images').send(newImage).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in image is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/api/v1/images')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newImage)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if file is not an image', async () => {
      await insertUsers([admin]);

      await request(app)
        .post('/api/v1/images')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Content-type', 'multipart/form-data')
        .field('name', newImage.name)
        .field('tags', newImage.tags)
        .field('isPrivate', newImage.isPrivate)
        .attach('file', path.resolve(__dirname, '../fixtures/testBadFileType.pdf'))
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if file is greater than 5mb', async () => {
      await insertUsers([admin]);

      await request(app)
        .post('/api/v1/images')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .set('Content-type', 'multipart/form-data')
        .field('name', newImage.name)
        .field('tags', newImage.tags)
        .field('isPrivate', newImage.isPrivate)
        .attach('file', path.resolve(__dirname, '../fixtures/testBadFileSize.jpeg'))
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /api/v1/images', () => {
    test('should return 200 and apply the default query options', async () => {
      await insertUsers([admin]);
      await insertImages([imageOne, imageTwo]);

      const res = await request(app)
        .get('/api/v1/images')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: imageOne._id.toHexString(),
        tags: imageOne.tags,
        isPrivate: imageOne.isPrivate,
        originalname: imageOne.originalname,
        size: imageOne.size.toString(),
        name: imageOne.name,
        user: imageOne.user.toHexString(),
      });
    });

    test('should return 401 if access token is missing', async () => {
      await request(app).get('/api/v1/images').send().expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 if a non-admin is trying to access all images', async () => {
      await insertUsers([userOne]);

      await request(app)
        .get('/api/v1/images')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send()
        .expect(httpStatus.FORBIDDEN);
    });

    describe('GET /api/v1/images/:imageId', () => {
      test('should return 200 and the image object if data is ok', async () => {
        await insertUsers([admin]);
        await insertImages([imageOne]);

        await request(app)
          .get(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.OK);
      });

      test('should return 401 error if access token is missing', async () => {
        await request(app).get(`/api/v1/images/${imageOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 200 and the image object if admin is trying to get another image', async () => {
        await insertUsers([admin]);
        await insertImages([imageOne]);

        await request(app)
          .get(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.OK);
      });

      test('should return 400 error if imageId is not a valid mongo id', async () => {
        await insertUsers([admin]);

        await request(app)
          .get('/api/v1/images/invalidId')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 404 error if image is not found', async () => {
        await insertUsers([admin]);

        await request(app)
          .get(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
    });

    describe('DELETE /api/v1/images/:imageId', () => {
      test('should return 204 if data is ok', async () => {
        await insertUsers([admin]);
        await insertImages([imageOne]);

        await request(app)
          .delete(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NO_CONTENT);

        const dbImage = await Image.findById(imageOne._id);
        expect(dbImage).toBeNull();
      });

      test('should return 401 error if access token is missing', async () => {
        await request(app).delete(`/api/v1/images/${imageOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 400 error if imageId is not a valid mongo id', async () => {
        await insertUsers([admin]);

        await request(app)
          .delete('/api/v1/images/invalidId')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.BAD_REQUEST);
      });

      test('should return 404 error if image already is not found', async () => {
        await insertUsers([admin]);

        await request(app)
          .delete(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send()
          .expect(httpStatus.NOT_FOUND);
      });
    });

    describe('PATCH /api/v1/images/:imageId', () => {
      test('should return 200 and successfully update image if data is ok', async () => {
        await insertUsers([admin]);
        await insertImages([imageOne]);

        const updateBody = {
          name: 'new name',
        };

        const res = await request(app)
          .patch(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.OK);

        expect(res.body).not.toHaveProperty('path');
        expect(res.body).toEqual({
          id: expect.anything(),
          name: updateBody.name,
          originalname: 'imageFixtureOne.jpeg',
          tags: imageOne.tags,
          isPrivate: imageOne.isPrivate,
          size: expect.anything(),
          user: expect.anything(),
        });

        const dbImage = await Image.findById(imageOne._id);
        expect(dbImage).toBeDefined();
      });

      test('should return 401 error if access token is missing', async () => {
        const updateBody = { name: 'new name' };
        await request(app).patch(`/api/v1/images/${imageOne._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
      });

      test('should return 200 and successfully update image if admin is updating another image', async () => {
        await insertUsers([admin]);
        await insertImages([imageOne]);

        const updateBody = { name: 'new name' };

        await request(app)
          .patch(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.OK);
      });

      test('should return 404 if admin is updating another image that is not found', async () => {
        await insertUsers([admin]);
        const updateBody = { name: 'new name' };

        await request(app)
          .patch(`/api/v1/images/${imageOne._id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.NOT_FOUND);
      });

      test('should return 400 error if imageId is not a valid mongo id', async () => {
        await insertUsers([admin]);
        const updateBody = { name: 'new name' };

        await request(app)
          .patch(`/api/v1/images/invalidId`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(updateBody)
          .expect(httpStatus.BAD_REQUEST);
      });
    });
  });
});
