//class import from productModel
const Product=require('../models/productModel')
const Cart=require('../models/cartModel')
 
//show data with fetchAll
exports.getProducts=(req,res,next)=>{
  Product.fetchAll()
  .then(products=>{
      res.render('shop/product-list',{
          prods:products,
          pageTitle:'All Products',
          path:'/products'
        });
  
  })
  .catch(err=>{
    console.log(err)
  })
   
 }

 //show data with fetchAll for index
exports.getIndex=(req,res,next)=>{

  Product.fetchAll()
      .then(products=>{
          res.render('shop/index',{
          prods:products,
          pageTitle:'Shop',
          path:'/'});
  
  })
  .catch(err=>{
    console.log(err)
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
  Product.findById(pordId)
  .then(product=>{
   return req.user.addToCart(product);
  })
  .then(result=>{
    console.log(result)
    res.redirect('/')
  })
  .catch(err=>console.log(err))
   
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
    Product.findById(prodId)
    .then(product=>{
      res.render('shop/product-detail',{
        product:product,
        path:'/products', 
        pageTitle:product.title
      })
    })
    .catch(err=>{
      console.log(err)
    })
   
    
  };

  