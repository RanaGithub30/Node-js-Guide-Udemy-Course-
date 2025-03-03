const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async function ({ userInput }, req){
        
        const email = userInput.email;
        const errors = [];

        // implement validation
        if(!validator.isEmail(email)){
            errors.push({message: "Email is Invalid"});
        }

        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 3 })) {
             errors.push({message: "Password too short"});
        }

        if(errors.length > 0){
            const error = new Error("Invalid Input");
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            const err = new Error('User Exists Already');
            throw err;
        }

        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const newUser = new User({
            email: email,
            name: userInput.name,
            password: hashedPw,
            status: "active"
        });

        const createdUser = await newUser.save();
        return { ...createdUser._doc, _id: createdUser._id.toString()};
    },

    login: async function ({ email, password }){
            const user = await User.findOne({email: email});
            if(!user){
                const error = new Error("User Not Found");
                error.code = 401;
                throw error;
            }

            const isEqual = await bcrypt.compare(password, user.password);
            if(!isEqual){
                const error = new Error("Password is Incorrect");
                error.code = 401;
                throw error;
            }

            const token = jwt.sign({
                userId: user._id.toString(),
                email: user.email
            }, 'supersecretkey', {  expiresIn: "1h" });

            return {token: token, userId: user._id.toString() };
    }
}