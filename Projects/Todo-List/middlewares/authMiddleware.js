// authMiddleware.js
exports.isAuthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next(); // User is authenticated, proceed to the next middleware
    } else {
        res.redirect('/'); // Redirect to login if not authenticated
    }
};

exports.attachUser = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user; // Attach user object to the request
    }
    next();
};