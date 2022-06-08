const fs=require('fs')
const path=require('path')
const cartData=path.join(path.dirname(require.main.filename),'data','cartData.json');


module.exports=class Cart{
    //[{id,qty}],totalPrice
    static addProduct(id,productPrice){
        //fetch the previous cart
        fs.readFile(cartData,(err,fileContent)=>{
            let cart={products:[],totalPrice:0}
            if(!err){
                cart=JSON.parse(fileContent);
            }
            //Analyze the cart => Find existing product
        const existingProductIndex= cart.products.findIndex(prod=> prod.id===id);
          
        const existingProduct=cart.products[existingProductIndex]
        let updatedProduct;
        if(existingProduct){
           updatedProduct={...existingProduct}
           updatedProduct.qty=updatedProduct.qty+1;
           cart.products=[...cart.products]
           cart.products[existingProductIndex]=updatedProduct;
        }else{
            updatedProduct={id:id,qty:1};
            cart.products=[...cart.products,updatedProduct]
        }
        cart.totalPrice=Number(cart.totalPrice )+ Number(productPrice);
        fs.writeFile(cartData,JSON.stringify(cart),err=>{
            console.log(err)
        })
    
    //And new product/increase the quantity

        })
        
    }
}