const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const authMiddleware = require('./middlewares/isAuth');
const { graphqlHTTP } = require('express-graphql'); // Correct import
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

require("dotenv").config();

const app = express();

// MongoDB Connection URI and Port
const MONGO_URI = process.env.MONGO_URI || "your-default-mongodb-uri";
const PORT = process.env.PORT || 3000;

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Flash Middleware
app.use(flash());

// Custom Middleware
app.use(authMiddleware);

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  formatError(err){
    if(!err.originalError){
      return err;
    }

    else{
      const data = err.originalError.data;
      const message = err.message || "An Error is Occured";
      const code = err.originalError.code || 500;
      return {message: message, status: code, data: data};
    }
  }
}));

// Database Connection and Server Start
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT} and connected to MongoDB`)
    );
  })
  .catch((err) => console.error("Database connection error:", err));