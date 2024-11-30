const csrf = require('csurf');

// CSRF Protection Middleware
const csrfProtection = csrf();

// Middleware to handle CSRF token errors gracefully
const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token. Please try again.' });
  }
  next(err);
};

// Middleware to add CSRF token to all views
const addCsrfToken = (req, res, next) => {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken(); // Makes CSRF token available in views
  }
  next();
};

module.exports = {
  csrfProtection,
  csrfErrorHandler,
  addCsrfToken,
};