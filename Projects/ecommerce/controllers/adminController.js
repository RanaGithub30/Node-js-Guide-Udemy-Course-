module.exports.index = (req, res, next) => {
    res.render('admin/login', { title: 'Login', pageUrl: 'login' });
}

module.exports.dashboard = (req, res, next) => {
    res.render('admin/dashboard', { title: 'Dashboard', pageUrl: 'dashboard' });
}

module.exports.profile = (req, res, next) => {
    res.render('admin/profile', { title: 'Profile', pageUrl: 'profile' });
}

module.exports.contact = (req, res, next) => {
    res.render('admin/contact', { title: 'Contact', pageUrl: 'contact' });
}

module.exports.usersLists = (req, res, next) => {
    res.render('admin/user/list', { title: 'UserList', pageUrl: 'UserList' });
}