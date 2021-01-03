# Shopify Backend Summer Internship Challenge 2021

- [**Challenge Details**](https://docs.google.com/document/d/1ZKRywXQLZWOqVOHC4JkF3LqdpO3Llpfk_CkZPR8bjak/edit)

## Live Demo

Click the link below to view the live app
- [**Live Demo**](http://cloud.hsohail.com)

![](demo.gif)

## Features

- Secure user registration and login
- Secure routes using sessions
- Upload images with validation
- Upload images with public or private visibility
- Upload multiple images
- Download images with public visibility

## Design Choices

I decided to store images on the servers filesystem instead of MongoDB, because this would allow for easier caching, and would not stress the database. When an image is uploaded, it is randomly hashed, and saved on the filesystem, a database entry is added for the image that includes information about it's author, original name and the location on the filesystem.

## Technologies

- Node.js
- EJS
- MongoDB Atlas
- CentOS
- Nginx

## Libraries

- Express
- Passport
- bCrypt
- Multer
- Mongoose
- Bootstrap

## Run Locally

Clone the repository and then run the following commands:

```$ cd shopify-challenge-2021```

```$ npm install```

```$ export MONGO_URI=mongo-DB-URI-goes-here```

```$ npm run dev```

## To-DO

- Dockerize application
- CI/CD pipeline using GitHub actions or GitLab
- Unit testing for client and server
- Load balancing
- Backups and rollbacks
- Admin interface for statistics and resource management