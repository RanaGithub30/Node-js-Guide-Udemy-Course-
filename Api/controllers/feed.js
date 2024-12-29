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

    if(!errors.isEmpty()){
        res.status(422).json({
            'msg': 'Validation Array',
            'errors': errors.array()
        });
    }

    const feed = new Feed({
        title: title,
        content: content,
        creator: creator,
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
            res.status(404).json({
                'msg': 'Can Not Find Any Feeds',
                'data': []
            });
        }

        feed.title = title;
        feed.content = content;
        feed.creator = creator;
        return feed.save();
    })
    .then(result => {
        res.status(200).json({
            'msg': 'Feed Updated Successfully',
            'data': result
        });
    })
    .catch(err => {
        res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    });
}

exports.postDelete = (req, res, next) => {
    const postId = req.params.postId;
    Feed.deleteOne({_id: postId})
    .then(result => {
        res.status(200).json({
            'msg': 'Feed Deleted Successfully',
            'data': []
        });
    })
    .catch(err => {
        res.status(500).json({
            'msg': 'Error',
            'errors': err
        });
    });   
}