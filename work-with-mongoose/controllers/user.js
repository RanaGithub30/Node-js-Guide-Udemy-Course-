const User = require('../models/user');

exports.userList = (req, res, next) => {
    return User.fetchAll().then(users => {
        res.render('User/list', {
            users: users,
            pageTitle: 'User List',
            path: '/user/list'
        });
    }).catch(err => console.log(err));
}

exports.userAdd = (req, res, next) => {
    res.render('User/add', {
        pageTitle: 'User Add',
        path: 'user'
    });
}

exports.userSave = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const userData = new User(name, email);
    userData.save().then(result => {
        res.redirect('/user/list');
    }).catch();
}