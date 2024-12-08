module.exports = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn || false;
    res.locals.csrfToken = req.csrfToken(); // Makes CSRF token available in all views
    res.locals.errorMessage = req.flash('error'); // Flash error messages
    res.locals.successMessage = req.flash('success'); // Flash success messages
    next();
  };  