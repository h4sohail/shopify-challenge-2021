const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const fs = require('fs');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

require('dotenv').config()
require('./config/passport')(passport);

const { SECRET, API_URL, PORT, MONGO_URI } = require('./config/constants');


// Connect to MongoDB
mongoose.connect(MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
    secret: SECRET,
    resave: true,
	saveUninitialized: true,
	store: new mongoStore({ mongooseConnection: mongoose.connection })
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
app.use('/', require('./routes/users.js'));
app.use(`/${API_URL}/`, require('./routes/api.js'));

// Uploads Folder
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.listen(PORT, console.log(`Server running on  http://localhost:${PORT}`));