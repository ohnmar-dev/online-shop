const fs=require('fs')
const path=require('path')
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
    constructor(id,title,image,price,description){
        this.id=id
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
}