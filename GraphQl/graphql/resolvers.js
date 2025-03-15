const User = require('../models/user');
const Post = require('../models/feed');
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
    },

    createPost: async function({postInput}, req){
        const errors = [];

        if(!req.isAuth){
            const error = new Error('Not Authenticated');
            error.code = 401;
            throw error;
        }

        if(validator.isEmpty(postInput.title) || validator.isLength(postInput.title, {min: 3})){
                errors.push({message: "Title is Invalid"});
        }
        if(validator.isEmpty(postInput.content) || validator.isLength(postInput.content, {min: 3})){
                errors.push({message: "Content is Invalid"});
        }

        const user = User.findOne({_id: req.userId});
        if(!user){
            errors.push({message: "Invalid User", "code": 401});
        }

        const newPost = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            creator: req.userId
        });

        const createdPost = await newPost.save();
        
        return {...createdPost._doc, _id: newPost._id.toString()};
    },

    allPosts: async function(args, req){
        if(!req.isAuth){
            const error = new Error('Not Authenticated');
            error.code = 401;
            throw error;
        }

        const totalPost = await Post.find({creator: req.userId}).countDocuments();
        const postsDetails = await Post.find({creator: req.userId}).sort({ createdAt: - 1 }).populate('creator');
        return {
            posts: postsDetails.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                };
            }),
            totalPosts: totalPost
        };
    }
}