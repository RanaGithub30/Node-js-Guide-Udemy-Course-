const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.signup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    const status = 'Active';

    if(!errors.isEmpty()){
        return res.status(422).json({
            'msg': 'Validation Array',
            'errors': errors.array()
        });
    }

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const user = new User({
            email: email,
            name: name,
            password: hashedPassword,
            status: status
        });

        return user.save();
    })
    .then(result => {
        res.status(201).json({
            'msg': 'User Signup Done Successfully',
            'data': result,
        });
    })
    .catch(err => {
        res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    });
}