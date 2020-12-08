require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();
const mongoose = require('mongoose');
const url = 'mongodb://localhost/pizza';
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const connection = mongoose.connection;
connection
  .once('open', () => {
    console.log('Database connected...');
  })
  .catch((err) => {
    console.log('Database connection failed...');
  });

// Flash
app.use(flash());

let mongoStore = new MongoDbStore({
  mongooseConnection: connection,
  collection: 'sessions',
});

// Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// Session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    store: mongoStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 Hours
  })
);

// Passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global Middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

// Set Template Engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

const server = app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

// Socket
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  // Join
  socket.on('join', (orderId) => {
    socket.join(orderId);
  });
});

eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data);
});
