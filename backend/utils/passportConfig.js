const passport = require('passport');
const userModel = require('../models/userModel');

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());
