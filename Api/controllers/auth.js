const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

exports.signin = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            'msg': 'Validation Array',
            'errors': errors.array()
        });
    }

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({email:email})
    .select(['-__v'])
    .then(user => {
        if(!user){
            res.status(404).json({
                'msg': 'Error',
                'errors': 'User with this Email Not Found'
            });
        }

        loadedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual){
            res.status(404).json({
                'msg': 'Error',
                'errors': 'Password Not Match'
            });
        }

        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 
        'secret', 
        {expiresIn: '1h'});

        return res.status(200).json({
            'msg': 'User Signin Successfully',
            'data': loadedUser,
            'token': token
        });
    })
    .catch(err => {
        return res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    })
}

exports.profile = (req, res, next) => {
    const userId = req.userId;
    User.findOne({_id: userId})
    .select(['-__v', '-password'])
    .then(user => {
        return res.status(500).json({
            'msg': 'User Profile',
            'data': user
        });
    })
    .catch(err => {
        return res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    })
}