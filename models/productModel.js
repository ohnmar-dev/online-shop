const fs=require('fs')
const path=require('path')
const shopData=path.join(path.dirname(process.mainModule.filename),'data','shopData.json');

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
    constructor(name){
        this.name=name
    }
    save(){
        //products.push(this) //push data
        getProductData((products)=>{
            products.push(this);
            fs.writeFile(shopData,JSON.stringify(products),(err)=>{
                console.log(err)
            })
        })
        
    }
    //show data
    static fetchAll(cb){
        getProductData(cb);
    }

}