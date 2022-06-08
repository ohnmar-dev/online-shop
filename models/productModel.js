const fs=require('fs')
const path=require('path')
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
        this.id=Math.random().toString();
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

    // testing id method
    static findById(id,cb){
         getProductData(products=>{
             const product=products.find(p=>p.id===id);
             cb(product)
         }) 
    }

}