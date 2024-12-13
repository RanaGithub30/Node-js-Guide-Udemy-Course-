const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

module.exports = session({
  secret: process.env.SESSION_SECRET || 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store,
});