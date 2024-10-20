const db = require('../util/database');

module.exports = class Cart {
        constructor(id, prod_id){
            this.id = id;
            this.prod_id = prod_id;
        }

        static addToCart(prodId){
            return db.execute('INSERT into carts (prod_id) VALUES(?)', 
                [prodId]
            );
        }

        static findById(prodId){
            return db.execute('SELECT * FROM carts WHERE id = ?', 
                [this.id]
            );
        }

        static getCart(){
            return db.execute('SELECT * FROM carts');
        }

        static cartDelete(prodId){
            return db.execute('Delete from carts where prod_id = ?', 
                [prodId]
            );
        }
};