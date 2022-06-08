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
    constructor(id,title,image,price,description){
        this.id=id
        this.title=title;
        this.image=image;
        this.price=price;
        this.description=description;



    }
    save(){
        
        getProductData((products)=>{
            if(this.id){
            const existingProductIndex=products.findIndex(prod=>prod.id===this.id)
            const updatedProducts=[...products]
            updatedProducts[existingProductIndex]=this;
            fs.writeFile(shopData,JSON.stringify(updatedProducts),(err)=>{
                console.log(err)
            })
            }
            else{
            this.id=Math.random().toString();
            products.push(this);
            fs.writeFile(shopData,JSON.stringify(products),(err)=>{
                console.log(err)
            })
            }
            
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