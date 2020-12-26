const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
const passport = require('passport');

const flash = require('connect-flash');
const session = require('express-session');

// // Load Stock model
// const Stock = require('./models/Stock');
// const Order = require('./models/Order');

// // Load Stock data
// const { stockData, orderData } = require('./data') 

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// // Populate Stocks in MongoDB
// stockData.forEach(stock => {
//   const newStock = new Stock();
//     newStock.name =  stock.name;
//     newStock.symbol = stock.symbol;
//     newStock.price = stock.price;
//   newStock.save();
// });

// // Populate Orders in MongoDB
// orderData.forEach(order => {
//   const newOrder = new Order();

//   newOrder.type =  order.type;
//   newOrder.price = order.price;
//   newOrder.fulfilled = order.fulfilled;
//   newOrder.shares = order.shares;
//   const filter = order.symbol
//   Stock.findOne({ filter }).then(stock => {
//     if (stock) {
//       newOrder.stock = stock;
//       newOrder.save();
//     }
//   });
// });

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
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// CSS
app.use(express.static(__dirname + '/views'));

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/repository', require('./routes/repository.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on  http://localhost:${PORT}`));