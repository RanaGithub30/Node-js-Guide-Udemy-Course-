module.exports.index = (req, res, next) => {
    res.render('front/index', { title: 'Home' });
};