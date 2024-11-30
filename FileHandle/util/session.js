// config/session.js
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
require('dotenv').config();

// Create a MongoDB session store
const store = new mongodbStore({
    uri: process.env.MONGO_URI, // Your MongoDB URI
    collection: 'sessions' // Optional: name the collection to store sessions
});

// Export configured session middleware
module.exports = session({
    secret: 'secret-session',      // Session secret for encryption
    resave: false,                  // Prevents resaving unchanged sessions
    saveUninitialized: false,       // Doesn't save sessions that are uninitialized
    store: store                    // MongoDB session store
});