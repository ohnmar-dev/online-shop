const fs=require('fs')
const path=require('path')
const mongodb=require('mongodb');
const getDb=require('../util/database').getDb

const shopData=path.join(path.dirname(require.main.filename),'data','shopData.json');

const getProductData=(cb)=>{
    fs.readFile(shopData,(err,fileContent)=>{
        if(err){
            cb([])
        }else{
            cb(JSON.parse(fileContent));
        }
    })
}
module.exports=class Product{
    constructor(title,image,price,description){

        this.title=title;
        this.image=image;
        this.price=price;
        this.description=description;



    }
    save(){
        const db=getDb();
        return db.collection('product')
        .insertOne(this)
        .then(result=>{
            console.log(result)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    static fetchAll(){
        const db=getDb();
        return db.collection('product')
        .find()
        .toArray()
        .then(products=>{
            console.log(products)
            return products;
        })
        .catch(err=>{
            console.log(err)
        })
    }
    static findById(prodId){
        const db=getDb();
        return db.collection('product')
        .find({_id:new mongodb.ObjectId(prodId)})
        .next()
        .then(product=>{
            console.log(product)
            return product;
        })
        .catch(err=>{
            console.log(err)
        })
    }
}