const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User{
    static collectionName = "users";
    
    constructor(name, email, id){
        this.name = name;
        this.email = email;
        this._id = id;
    }

    save(){
        const db = getDb();
        let dbOp;

        if(this._id){
            // update the user
            dbOp = db.collection(User.collectionName).updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {name: this.name, email:this.email}}
            );
        }
        else{
            dbOp = db.collection(User.collectionName)
            .insertOne(this);
        }

        return dbOp.then()
        .catch(err => console.log(err));
    }

    static findById(userId){
        const db = getDb();
        return db.collection(Usre.collectionName)
        .find({_id: new mongodb.ObjectId(userId)})
        .next()
        .then(user => {
            return user;
        })
        .catch(err => console.log(err));
    }

    static fetchAll(){
        const db = getDb();
        return db.collection(User.collectionName).find().toArray()
        .then(users => {
            console.log(users);
            return users;
        }).catch(err => console.log(err));
    }
}

module.exports = User;