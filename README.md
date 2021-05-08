# Shopify Backend Summer Internship Challenge 2021

- [**Challenge Details**](https://docs.google.com/document/d/1ZKRywXQLZWOqVOHC4JkF3LqdpO3Llpfk_CkZPR8bjak/edit)

- **Now with lots of tests** 98.2% Test Coverage!

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/mongo-db

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Image routes**:\
`POST api/v1/images` - create image(s)\
`GET api/v1/images` - get all images\
`GET api/v1/images/:imageId` - download an image\
`PATCH api/v1/images/:imageId` - update image\
`DELETE api/v1/images/:imageId` - delete image

**User routes**:\
`POST api/v1/users` - create a user\
`GET api/v1/users` - get all users\
`GET api/v1/users/:userId` - get user\
`PATCH api/v1/users/:userId` - update user\
`DELETE api/v1/users/:userId` - delete user

**Auth routes**:\
`POST api/v1/auth/register` - register\
`POST api/v1/auth/login` - login\
`POST api/v1/auth/refresh-tokens` - refresh auth tokens\
`POST api/v1/auth/forgot-password` - send reset password email\
`POST api/v1/auth/reset-password` - reset password\
`POST api/v1/auth/send-verification-email` - send verification email\
`POST api/v1/auth/verify-email` - verify email

## License

[MIT](LICENSE)
