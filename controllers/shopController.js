//class import from productModel
const Product=require('../models/productModel')

 
//show data with fetchAll
exports.getProducts=(req,res,next)=>{
  Product.fetchAll((products)=>{
     res.render('shop/product-list',{
         prods:products,
         pageTitle:'All Products',
         path:'/products'});
  })
   
 }

 //show data with fetchAll for index
exports.getIndex=(req,res,next)=>{
  Product.fetchAll((products)=>{
     res.render('shop/index',{
         prods:products,
         pageTitle:'Shop',
         path:'/'});
  })
   
 }

 //for cart
 exports.getCart=(req,res,next)=>{
   res.render('shop/cart',{
     path:'/cart',
     pageTitle:'Your Cart'
   })
 };

  //for chackout
  exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
      path:'/checkout',
      pageTitle:'Your Checkout'
    })
  };

  //for Orders
  exports.getOrder=(req,res,next)=>{
    res.render('shop/orders',{
      path:'/orders',
      pageTitle:'Your Orders'
    })
  };