const db = require('../util/database');

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

  update(id){
      return db.execute('UPDATE products SET title = ?, price =?, description =?, image =? WHERE id = ?', 
        [this.title, this.price, this.description, this.imageUrl, id]);
  }

  static deleteById(id) {
    return db.execute('DELETE FROM products WHERE id = ?', [id]);
  }

  static fetchAll() {
     return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE id = ?', [id]);
  }
};