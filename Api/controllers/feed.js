const path = require('path');
const fs = require('fs');
const Feed = require('../models/feed');
const { validationResult } = require('express-validator');

exports.getPost = (req, res, next) => {
    Feed.find()
    .select(['-__v', '-creator']) // select all except __v & creator
    .then(feeds => {
        res.status(200).json({
            'msg': 'success',
            'data': feeds
        });
    })
    .catch(err => {
        res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    });
}

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const creator = req.body.creator;
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

    const feed = new Feed({
        title: title,
        content: content,
        creator: creator,
        imageUrl: image
    });
    feed
    .save()
    .then(feed => {
        res.status(201).json({
            'msg': 'Success',
            'data': feed
        });
    })
    .catch(err => {
        res.status(500).json({
            'msg': err
        });
    });
}

exports.postDetails = (req, res, next) => {
    const postId = req.params.postId;

    Feed.findById(postId)
    .then(feed => {
        if(!feed){
            res.status(404).json({
                'msg': 'Can Not Find Any Feeds',
                'data': []
            });    
        }

        res.status(200).json({
            'msg': 'success',
            'data': feed
        });
    })
    .catch(err => {
        res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    });
}

exports.postUpdate = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const creator = req.body.creator;
    const postId = req.params.postId;

    Feed.findById(postId)
    .then(feed => {
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
        return feed.save();
    })
    .then(result => {
        let fullIMagePath = fullImagePath(req, result.imageUrl);
        result.imageUrl = fullIMagePath;

        return res.status(200).json({
            'msg': 'Feed Updated Successfully',
            'data': result
        });
    })
    .catch(err => {
        return res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    });
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


exports.postDelete = (req, res, next) => {
    const postId = req.params.postId;

    Feed.findById(postId)
        .then(feed => {
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
            return Feed.deleteOne({ _id: postId });
        })
        .then(result => {
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
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                msg: 'Error',
                errors: err
            });
        });
};