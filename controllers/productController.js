//class import from productModel
const Product=require('../models/productModel')

exports.getController=(req,res,next)=>{
    res.render('add-product', {
        pageTitle:"Add Product",
        path:'/admin/add-product',
    })
    }
// save data 
exports.postController=(req,res,next)=>{
    const product=new Product(req.body.name)
    console.log(product)
    product.save();
    res.redirect('/');

}
//show data with fetchAll
exports.shopController=(req,res,next)=>{
  Product.fetchAll((products)=>{
     res.render('shop',{
         prods:products,
         pageTitle:'Shop',
         path:'/'});
  })
   
 }