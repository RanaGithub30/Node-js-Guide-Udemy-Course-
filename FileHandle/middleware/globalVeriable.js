module.exports = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn || false;
    res.locals.csrfToken = req.csrfToken(); // Makes CSRF token available in all views
    res.locals.errorMessage = req.flash('error'); // Pass flash error messages to views
    res.locals.successMessage = req.flash('success'); // Pass flash success messages to views
    next();
};  