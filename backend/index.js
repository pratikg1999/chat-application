const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const sendResponse = require('./utils/apiOut').sendResponse;
const userRouter = require('./routes/userRouter');
const homeRouter = require('./routes/homeRouter');
const socketController = require('./controllers/socketController.js');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost', `${process.env.NGROCK_URL}`],
    methods: ['GET', 'POST'],
    // allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

// Configs
require('dotenv').config();
require('./utils/passportConfig');

// Setting-up mongoose
console.log(process.env.MONGO_URL);
const connect = mongoose.connect(process.env.MONGO_URL);
connect.then(
  (db) => {
    console.log('Connected correctly to server');
  },
  (err) => {
    console.log(err);
  },
);

console.log('ngrock', `${process.env.NGROCK_URL}`);
app.use(logger('dev'));
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost', `${process.env.NGROCK_URL}`],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Setting up routes
app.use('/api/user', userRouter);
app.use('/api/', homeRouter);

//setup sockets
socketController(io);

// Setting up error handler
const errorHandler = (err, req, res, next) => {
  return sendResponse(res, 500, { err: err.message });
};
app.use(errorHandler);

const port = process.env.PORT || 5000;
http.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
