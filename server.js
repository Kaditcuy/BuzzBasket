const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('./utils/db');
const User = require('./models/user');
const router = require('./routes/index');
require('dotenv').config();

export const app = express();
const PORT = process.env.PORT || 5000;

const sessionSecret = process.env.SESSION_SECRET; // random key used to encrypt sessiondata

console.log('Starting Server...');

// Use cookie-parser middleware
app.use(cookieParser());

// Json body parsing middleware to parse json data from the request body
app.use(express.json());

// Add middleware for session management
app.use(session({ secret: sessionSecret, resave: true, saveUninitialized: false}));

// Initializing Passport and configuring it for authentication
// using passport-local strategy for a mongodb
app.use(passport.initialize());// initializing passport for use by the app
app.use(passport.session()); // sets passport to use sessions for authentication



// Configure Passport to use a LocalStrategy with passport-local-mongoose
function verifyPassword (user, password) {
  if (user.password === password) {
    return true;
  };
}

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
  },
  async function(username, password, done) {
    const user = await User.findOne({ username });
    if (!user) { return done(null, false); }
    if (!verifyPassword(user, password)) { return done(null, false); }
     return done(null, user);
  }) 
)
// app.use(passport.initialize());// initializing passport for use by the app

// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', router);

app.use((req, res ) => {
  res.status(404).json({ message: 'Resource not found' });
}); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// module.exports = passport;
export default app;
