// db
const db = require('../util/database');

const Cart = require('./cart');

const getProductsFromFile = cb => {
  
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute('INSERT into products (title, price, description, image) VALUES (?, ?, ?, ?)', 
      [this.title, this.price, this.description, this.imageUrl]);
  }

  static deleteById(id) {
    
  }

  static fetchAll() {
     return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    
  }
};