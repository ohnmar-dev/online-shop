//class import from productModel
const Product=require('../models/productModel')
const Cart=require('../models/cartModel')
const User=require('../models/user')
const Order=require('../models/order')

 
//show data with fetchAll
exports.getProducts=(req,res,next)=>{
  Product.find()
  .then(products=>{
      res.render('shop/product-list',{
          prods:products,
          pageTitle:'All Products',
          path:'/products',
          isAuthenticated: req.session.isLoggedIn
        });
  
  })
  .catch(err=>{
    console.log(err)
  })
   
 }

 //show data with fetchAll for index
exports.getIndex=(req,res,next)=>{

  Product.find()
      .then(products=>{
          res.render('shop/index',{
          prods:products,
          pageTitle:'Shop',
          path:'/',
          isAuthenticated: req.session.isLoggedIn
        });
  
  })
  .catch(err=>{
    console.log(err)
  })

   
 }

 //for cart
 exports.getCart=(req,res,next)=>{
  req.user
  .populate('cart.items.productId')
    .then(user=>{
      const products=user.cart.items
      console.log(user.cart.items)
      res.render('shop/cart',{
        path:'/cart',
        pageTitle:'Your Cart',
        products:products,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err=>console.log(err))
   
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
    res.redirect('cart')
  })
  .catch(err=>console.log(err))
   
 }

 //for delete cart
 exports.deleteCart=(req,res,next)=>{
    const prodId=req.body.productId;
    req.user
      .deleteItemFromCart(prodId)
      .then(()=>{
        console.log("delete success")
        res.redirect('/cart')
      })
      .catch(err=>console.log(err))
 }

  //for chackout
  exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
      path:'/checkout',
      pageTitle:'Your Checkout',
      isAuthenticated: req.session.isLoggedIn
    })
  };

  //for Orders
  exports.getOrder=(req,res,next)=>{
    Order.find({'user.userId':req.user._id})
    .then(orders=>{
      res.render('shop/orders',{
        path:'/orders',
        pageTitle:'Your Orders',
        orders:orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err=>console.log(err))
    
  };
  
  //for post order
  exports.postOrder=(req,res,next)=>{
          req.user
          .populate('cart.items.productId')
            .then((user)=>{
              const products=user.cart.items.map(i=>{
                return {productId:{...i.productId._doc},quantity:i.quantity}
              })
              const order=new Order({
                user:{
                  userId:req.user,
                  name:req.user.name
                },
                products:products
              })
              return order.save( )
            })
            .then(()=>{
              return req.user.clearCart()
              
            })
            .then(()=>{
              res.redirect('/orders')

            })
            .catch(err=>console.log(err))
  }

  //for getDetail
  exports.getDetail=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findById(prodId)
    .then(product=>{
      res.render('shop/product-detail',{
        product:product,
        path:'/products', 
        pageTitle:product.title,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err=>{
      console.log(err)
    })
   
    
  };

  