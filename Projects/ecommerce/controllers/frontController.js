module.exports.index = (req, res, next) => {
    res.render('front/index', { title: 'Home' });
};

module.exports.shop = (req, res, next) => {
    res.render('front/shop', {title: 'Shop'});
};

module.exports.whyUs = (req, res, next) => {
    res.render('front/why-us', {title: 'Why Us'});
};

module.exports.testimonial = (req, res, next) => {
    res.render('front/testimonial', {title: 'Testimonial'});
};

module.exports.contact = (req, res, next) => {
    res.render('front/contact', {title: 'Contact'});
};