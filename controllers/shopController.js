//class import from productModel
const Product=require('../models/productModel')
const Cart=require('../models/cartModel')
 
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

 //for post cart
 exports.postCart=(req,res,next)=>{
   const pordId=req.body.productId;
  Product.findById(pordId,product=>{
    Cart.addProduct(pordId, product.price);
  })
   
    res.redirect('/')
 }

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

  //for getDetail
  exports.getDetail=(req,res,next)=>{
    const prodId=req.params.productId;
   Product.findById(prodId,(product)=>{
    res.render('shop/product-detail',{
      product:product,
      path:'/products', 
      pageTitle:product.title
    })
   })
    
  };

  