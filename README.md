# Shopify Backend Summer Internship Challenge 2021

- [**Challenge Details**](https://docs.google.com/document/d/1ZKRywXQLZWOqVOHC4JkF3LqdpO3Llpfk_CkZPR8bjak/edit)

## Live Demo

Click the link below to view the live app
- [**Heroku Instance (W.I.P)**](https://herokuapp.com)

## Features

- Secure user registration and login
- Secure routes with sessions
- Secure image upload, using sessions
- Secure image download, using sessions
- Upload with permissions, private or public
- Dashboard page to manage self uploads
- Repository page to view all public uploads

## Design Choices

I decided to store images on the servers filesystem instead of MongoDB, because this would allow for easier caching, and would not stress the database. When an image is uploaded, it is randomly hashed, and saved on the filesystem, a database entry is added for the image including it's author, original name and the location on the file system.

## Technologies

- Node.js
- EJS
- MongoDB Atlas

## Libraries

- Express
- Passport
- bcrypt
- crypto
- Formidable
- Mongoose
- Bootswatch and Bootstrap

## Run Locally

Clone the repository and then run the following commands:

```$ cd shopify-challenge-2021```

```$ npm install```

```$ export URI=mongo-DB-URI-goes-here```

```$ npm run dev```

## To-DO

- Dockerize application
- CI/CD pipeline using GitHub actions or GitLab
- Unit testing for client and server
- Load balancing
- Backups and rollbacks
- Admin interface for statistics and resource management
- Automatic scaling with AWS/Atlas