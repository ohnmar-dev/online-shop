const mongodb=require('mongodb');

const MongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=(callback)=>{
    MongoClient.connect(
        'mongodb+srv://root:root@cluster0.gkh0oe5.mongodb.net/shop?retryWrites=true&w=majority',
        {useUnifiedTopology: true,
        useNewUrlParser:true}
    )
    .then(client=>{
        console.log('Conneted !');
        _db=client.db();
        callback();
        
    })
    .catch(err=>{
        console.log(err)
    })
}
const getDb=()=>{
    if(_db){
        return _db;
    }
    throw "No found database"
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;