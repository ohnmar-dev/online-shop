const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const productSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

})

module.exports=mongoose.model('Product',productSchema)
// const fs=require('fs')
// const path=require('path')
// const mongodb=require('mongodb');
// const getDb=require('../util/database').getDb

// const shopData=path.join(path.dirname(require.main.filename),'data','shopData.json');

// const getProductData=(cb)=>{
//     fs.readFile(shopData,(err,fileContent)=>{
//         if(err){
//             cb([])
//         }else{
//             cb(JSON.parse(fileContent));
//         }
//     })
// }
// module.exports=class Product{
//     constructor(title,image,price,description,id,userId){

//         this.title=title;
//         this.image=image;
//         this.price=price;
//         this.description=description;
//        // this._id=id;
//         this._id= id? new mongodb.ObjectId(id) : null;
//         this.userId=userId;



//     }
//     save(){
//         const db=getDb();
//         let dbOp;
//         if(this._id){
//             //updated the product
//             dbOp=db.collection('product')
//                     .updateOne({_id:new mongodb.ObjectId(this._id)},{$set:this})

//         }else{
//             dbOp=db.collection('product').insertOne(this);
//         }
//         return dbOp
//         .then(result=>{
//             console.log(result)
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     }

//     static fetchAll(){
//         const db=getDb();
//         return db.collection('product')
//         .find()
//         .toArray()
//         .then(products=>{
//             console.log(products)
//             return products;
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     }
//     static findById(prodId){
//         const db=getDb();
//         return db.collection('product')
//         .find({_id:new mongodb.ObjectId(prodId)})
//         .next()
//         .then(product=>{
//             console.log(product)
//             return product;
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     }
//     //delete product
//     static deleteById(id){
//         const db=getDb();
//         return db.collection('product')
//         .deleteOne({_id:new mongodb.ObjectId(id)})
//         .then(result=>{
//             console.log("Deleted Successfully")
//         })
//         .catch(err=>console.log(err))
//     }
// }