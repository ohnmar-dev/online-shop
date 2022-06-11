const { ObjectId } = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
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
}
module.exports = User;
