const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signup = async (req, res, next) => {
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

    try{
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
            email: email,
            name: name,
            password: hashedPassword,
            status: status
        });

    const result = user.save();
    
    res.status(201).json({
        'msg': 'User Signup Done Successfully',
        'data': result,
    });
    }catch (err) {
        res.status(500).json({
            'msg': 'Error',
            'errors': err.message || err
        });
    };
}

exports.signin = async (req, res, next) => {
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

    try{
        const user = await User.findOne({email:email}).select(['-__v']);
        
        if(!user){
            res.status(404).json({
                'msg': 'Error',
                'errors': 'User with this Email Not Found'
            });
        }

        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);

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
    }
    catch(err){
        return res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    }
}

exports.profile = async (req, res, next) => {
    const userId = req.userId;

    try{    
        const user = await User.findOne({_id: userId}).select(['-__v', '-password']);

        return res.status(200).json({
            'msg': 'User Profile',
            'data': user
        });
    }
    catch(err){
        return res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    }
}