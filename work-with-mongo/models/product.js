const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product{
  static collectionName = 'products';


  constructor(title, price, description, imageUrl, id){
      this.title = title;
      this.price = price;
      this.description = description;
      this.imageUrl = imageUrl;
      this._id = id;
  }

  /** Insert one data at a time */

  save(){
    const db = getDb();
    let dbOp;

    if(this._id){
         // Update the record
         console.log(this);
         dbOp = db.collection(Product.collectionName).updateOne(
          { _id: new mongodb.ObjectId(this._id) }, // Change this line
          { $set: { title: this.title, price: this.price, description: this.description, imageUrl: this.imageUrl } } // Specify fields to update
        );
    }
    else{
        // create a new record
        dbOp = db.collection(Product.collectionName).insertOne(this);
    }

    return dbOp
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));

  }

  static fetchAll(){
      const db = getDb();
      return db.collection(Product.collectionName)
      .find()
      .toArray()
      .then(products => {
         return products;
      })
      .catch(err => console.log(err));
  }

  static findById(prodId){
    const db = getDb();
    return db.collection(Product.collectionName)
    .find({_id: new mongodb.ObjectId(prodId)})
    .next()
    .then(product => {
       return product;
    })
    .catch(err => {
      console.log(err);
    });
  }
}

module.exports = Product;