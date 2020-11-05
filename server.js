//___________________
//Dependencies
//___________________
require('dotenv').config();
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session')

const app = express ();
const db = mongoose.connection;


//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;




//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/'+ 'md-project2';
// Connect to Mongo
mongoose.connect(MONGODB_URI ,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });



// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));
// open the connection to mongo
db.on('open' , ()=>{});



//___________________
//Middleware
app.use(
    session({
      secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
      resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
      saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
  )
//___________________
//use public folder for static assets
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form
// Set EJS as templating engine  
app.set("view engine", "ejs"); 



//CONTROLLERS
const bookController = require('./controllers/bookControllers');
app.use('/books',bookController);
//For authors route
const authorControllers = require('./controllers/authorControllers');
app.use('/authors',authorControllers);

//For User route
const userControllers = require('./controllers/userControllers');
app.use('/users',userControllers);
//Session Route
const sessionsController = require('./controllers/sessions_controller')
app.use('/sessions', sessionsController)

//client side cart Route
const cartController = require('./controllers/cartControllers')
app.use('/carts', cartController)
//Order Routes
const orderController = require('./controllers/orderControllers')
app.use('/orders', orderController)

//___________________
// ROUTES
//___________________
//localhost:3000
app.get('/' , (req, res) => {
  res.redirect('/books')
});
//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));