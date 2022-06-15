const { ObjectId } = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart=cart;
    this._id=id;
  }
  save() {
    const db = getDb();
    return db.collection("user").insertOne(this);
  }
  static findById(userId) {
    const db = getDb();
    return db
      .collection("user")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
  addToCart(product){
      const updateCart={items:[{productId:new ObjectId(product.id),quantity:1}]}
      console.log(updateCart)
      const db = getDb();
      return db.collection("user").updateOne({_id:new ObjectId(this._id)},
      {$set:{cart:updateCart}}
      )
  }
  
}
module.exports = User;
