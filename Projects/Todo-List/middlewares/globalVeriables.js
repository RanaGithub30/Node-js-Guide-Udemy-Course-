module.exports = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // Set CSRF token
    res.locals.errorMessage = []; // Default empty error messages
    res.locals.oldInput = undefined; // Default old input as undefined
    next();
}