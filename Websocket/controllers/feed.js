const path = require('path');
const fs = require('fs');
const Feed = require('../models/feed');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.getPost = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const pagePage = 3;
    let totalItemms;
    let userId = req.userId;

    try{
        const count = await Feed.find({ creator: userId }).select(['-__v', '-creator']).countDocuments();
        const feeds = await Feed.find({ creator: userId }).skip((currentPage - 1) * pagePage).limit(pagePage);
        totalItemms = count;

        res.status(200).json({
            'msg': 'success',
            'data': feeds,
            currentPage,
            pagePage,
            'totalItems': totalItemms
        });
    }
    catch(err){
        res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    };
}

exports.createPost = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const creator = req.userId;
    let creatorDetails;
    const errors = validationResult(req);
    let image = "";

    if(!errors.isEmpty()){
        return res.status(422).json({
            'msg': 'Validation Array',
            'errors': errors.array()
        });
    }

    if(req.file){
        image = req.file.path;
    }

    try{
        const feed = new Feed({
            title: title,
            content: content,
            creator: creator,
            imageUrl: image
        });

        const result = await feed.save();
        const user = await User.findById(creator);
        creatorDetails = user;
        
        user.feeds.push(feed);
        const feedDetails = await user.save();
        
        res.status(201).json({
            'msg': 'Success',
            'feeds': feed,
            'ctreator': creatorDetails
        });
    }
    catch(err){
        res.status(500).json({
            'msg': err
        });
    };
}

exports.postDetails = async (req, res, next) => {
    const postId = req.params.postId;
    let feedDetails;
    let userId = req.userId;

    try{
        const feed = await Feed.findById(postId);
        
        if(!feed){
            return res.status(404).json({
                'msg': 'Can Not Find Any Feeds',
                'data': []
            });    
        }

        if(feed.creator != userId){
            return res.status(403).json({
                'msg': 'Unauthorized',
                'data': []
            });   
        }

        feedDetails = feed;
        const user = await User.findById(feedDetails.creator);
        
        return res.status(200).json({
            'msg': 'success',
            'feed': feedDetails,
            'creator': user
        });
    }
    catch(err) {
        return res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    };
}

exports.postUpdate = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const creator = req.userId;
    const postId = req.params.postId;

    try{
        const feed = await Feed.findById(postId);

        if(!feed){
            return res.status(404).json({
                'msg': 'Can Not Find Any Feeds',
                'data': []
            });
        }

        if (req.file && feed.imageUrl) {
            clearImage(feed.imageUrl);
        }

        feed.title = title;
        feed.content = content;
        feed.creator = creator;
        feed.imageUrl = (req.file) ? (req.file.path) : feed.imageUrl;
        const result = await feed.save();
    
        let fullIMagePath = fullImagePath(req, result.imageUrl);
        result.imageUrl = fullIMagePath;

        return res.status(200).json({
            'msg': 'Feed Updated Successfully',
            'data': result
        });
    }
    catch(err){
        return res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    };
}

const fullImagePath = (req, filePath) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const cleanedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath; // Remove leading slash
    return `${baseUrl}/${cleanedPath}`;
};

const clearImage = (filePath) => {
    if (!filePath) {
        return false;
    }
    const cleanedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    fs.unlink(cleanedPath, (err) => {
        if (err) {
            return false;
        }
    });
    return true;
};


exports.postDelete = async (req, res, next) => {
    const postId = req.params.postId;

    try{
            const feed = await Feed.findById(postId);

            if (!feed) {
                return res.status(404).json({
                    msg: 'Feed not found',
                    data: []
                });
            }

            // Use the clearImage method to delete the associated image
            if (feed.imageUrl) {
                clearImage(feed.imageUrl); // Asynchronous; doesn't affect the flow
            }

            // Delete the feed
            const result =  await Feed.deleteOne({ _id: postId });
            
            if (result.deletedCount === 0) {
                return res.status(404).json({
                    msg: 'Feed not found or already deleted',
                    data: []
                });
            }

            res.status(200).json({
                msg: 'Feed deleted successfully',
                data: []
            });
        }
        catch(err) {
            console.error(err);
            res.status(500).json({
                msg: 'Error',
                errors: err
            });
        };
};