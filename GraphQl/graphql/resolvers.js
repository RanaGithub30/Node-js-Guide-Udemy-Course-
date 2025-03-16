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

    allPosts: async function({page}, req){
        if(!req.isAuth){
            const error = new Error('Not Authenticated');
            error.code = 401;
            throw error;
        }

        if(!page){
            page = 1;
        }

        const perPage = 1;

        const totalPost = await Post.find({creator: req.userId}).countDocuments();
        const postsDetails = await Post.find({creator: req.userId})
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: - 1 })
        .populate('creator');

        const totalPages = Math.ceil(totalPost / perPage);

        // Base URL (change as per your API domain)
        const baseUrl = `${req.protocol}://${req.get("host")}/graphql`;

        // Construct next and previous page links
        const nextPageUrl = page < totalPages ? `${baseUrl}?query={allPosts(page:${page + 1})}` : null;
        const prevPageUrl = page > 1 ? `${baseUrl}?query={allPosts(page:${page - 1})}` : null;

        return {
            posts: postsDetails.map(p => ({
                ...p._doc,
                _id: p._id.toString(),
            })),
            totalPosts: totalPost,
            currentPage: page,
            totalPages: totalPages,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            nextPageUrl: nextPageUrl,
            prevPageUrl: prevPageUrl
        };
    },

    singlePost: async function ({postId}, req){
        if(!req.isAuth){
            const error = new Error('Not Authenticated');
            error.code = 401;
            throw error;
        }

        const post = await Post.findById(postId).populate('creator');
        
        if (!post) {
            const error = new Error("Post not found");
            error.code = 404;
            throw error;
        }
    
        return {
            ...post._doc,
            _id: post._id,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            creator: {
                _id: post.creator._id.toString(),
                name: post.creator.name,
                email: post.creator.email,
                status: post.creator.status
            }
        };
    },

    updatePost: async function ({ postId, postInput }, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
    
        const post = await Post.findById(postId).populate("creator");
        if (!post) {
            const error = new Error("Post not found");
            error.code = 404;
            throw error;
        }
    
        // Check if the logged-in user is the owner of the post
        if (post.creator._id.toString() !== req.userId.toString()) {
            const error = new Error("Not authorized to edit this post");
            error.code = 403;
            throw error;
        }
    
        // Validate inputs
        const errors = [];
        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 3 })) {
            errors.push({ message: "Title is Invalid" });
        }
        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 3 })) {
            errors.push({ message: "Content is Invalid" });
        }
        if (errors.length > 0) {
            const error = new Error("Invalid Input");
            error.data = errors;
            error.code = 422;
            throw error;
        }
    
        // Update post data
        post.title = postInput.title;
        post.content = postInput.content;
        post.imageUrl = postInput.imageUrl;
    
        const updatedPost = await post.save();
    
        return {
            ...updatedPost._doc,
            _id: updatedPost._id.toString(),
            createdAt: updatedPost.createdAt.toISOString(),
            updatedAt: updatedPost.updatedAt.toISOString(),
            creator: {
                _id: post.creator._id.toString(),
                name: post.creator.name,
                email: post.creator.email,
                status: post.creator.status
            }
        };
    },
    deletePost: async function ({ postId }, req) {
        if (!req.isAuth) {
            const error = new Error("Not Authenticated");
            error.code = 401;
            throw error;
        }
    
        const post = await Post.findById(postId).populate("creator");
        if (!post) {
            const error = new Error("Post not found");
            error.code = 404;
            throw error;
        }
    
        // Ensure the logged-in user is the owner of the post
        if (post.creator._id.toString() !== req.userId.toString()) {
            const error = new Error("Not authorized to delete this post");
            error.code = 403;
            throw error;
        }
    
        await Post.findByIdAndDelete(postId);
    
        return true; // Return true for successful deletion
    }        
}