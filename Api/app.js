const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const headerMiddlewares = require("./middlewares/headers");
const fileUploadMiddleware = require("./middlewares/fileUpload");
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

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Static Files Middleware
app.use('/images', express.static(path.join(__dirname, "images")));

// Custom Middleware
app.use(headerMiddlewares);
app.use(fileUploadMiddleware);

// Routes
const feedRoute = require("./routes/feed");
app.use("/api/v1/feed", feedRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

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