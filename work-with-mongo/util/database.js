const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

/** create connection with mongo */
mongoose.connect('mongodb://127.0.0.1:27017/mongoLearn1', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));