const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.get('Authorization')){
        const token = req.get('Authorization').split(' ')[1];
        let decodedToken;
    
        try{
            decodedToken = jwt.verify(token, 'secret'); // 'secret' same as secret name at the time of login
        }catch(err){
            err.statusCode = 500;
            throw err;
        }
    
        if(!decodedToken){
            res.status(401).json({
                'msg': 'Error',
                'errors': 'Not Authenticated'
            });
        }
    
        req.userId = decodedToken.userId;
        next();
    }else{
        res.status(401).json({
            'msg': 'Error',
            'errors': 'Not Authenticated'
        });
    }
}