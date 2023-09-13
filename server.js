const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const app = express();

const sessionSecret = process.env.SESSION_SECRET; // random key used to encrypt sessiondata
// Add middleware for session management
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));

// Initializing Passport and configuring it for authentication
// using passport-local strategy for a mongodb
app.use(passport.initialize());// initializing passport for use by the app
app.use(passport.session()); // sets passport to use sessions for authentication

// Configure Passport to use a LocalStrategy with passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
