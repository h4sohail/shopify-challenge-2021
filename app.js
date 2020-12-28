const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

const fs = require('fs');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// CSS
app.use(express.static(__dirname + '/views'));

// Routes
app.use('/', require('./routes/views.js'));
app.use('/users', require('./routes/users.js'));
app.use('/repository', require('./routes/images.js'));

// Uploads Folder
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  http://localhost:${PORT}`));