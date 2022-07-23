//class import from productModel
const Product=require('../models/productModel')
const Cart=require('../models/cartModel')
const User=require('../models/user')
const Order=require('../models/order')
const fs=require('fs')
const path=require('path')
const PDFDocument=require('pdfkit')
//show data with fetchAll
exports.getProducts=(req,res,next)=>{
  Product.find()
  .then(products=>{
      res.render('shop/product-list',{
          prods:products,
          pageTitle:'All Products',
          path:'/products',
         
          
        });
  
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500;
    return next(error);
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
          
        });
  
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500;
    return next(error);
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
        
      })
    })
    .catch(err=>{
      const error=new Error(err)
      error.httpStatusCode=500;
      return next(error);
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
    res.redirect('cart')
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500;
    return next(error);
})
   
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
      .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500;
        return next(error);
    })
 }

  //for chackout
  exports.getCheckout=(req,res,next)=>{
    res.render('shop/checkout',{
      path:'/checkout',
      pageTitle:'Your Checkout',
     
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
        
      })
    })
    .catch(err=>{
      const error=new Error(err)
      error.httpStatusCode=500;
      return next(error);
  })
    
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
                  email:req.user.email
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
            .catch(err=>{
              const error=new Error(err)
              error.httpStatusCode=500;
              return next(error);
          })
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
        
      })
    })
    .catch(err=>{
      const error=new Error(err)
      error.httpStatusCode=500;
      return next(error);
  })
    
  };

  

  // for invoice download

  exports.getInvoice=(req,res,next)=>{
    const orderId=req.params.orderId;
    Order.findById(orderId)
      .then(order=>{
        if(!order){
          return next(new Error('Order Not found') )
        
         
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
          return next(new Error('Unauthorized') )
        
        }
        const pdfDoc=new PDFDocument();
        const invoiceName='invoice-'+orderId+'.pdf'
        const invoicePath=path.join('data','invoice',invoiceName)
        res.setHeader('Content-Type','application/pdf')
        res.setHeader('Content-Disposition',`inline;filename=${invoicePath}`)
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res)
        // pdfDoc.text('Hello World')
        pdfDoc.fontSize(25).text('Invoice',{
          underline:true
        })
        let totalPrice=0;
        order.products.forEach(product => {
          totalPrice+=product.quantity*product.productId.price;
          pdfDoc.fontSize(15).text(
            product.productId.title +'-'+ 
            product.quantity +'-'+ 
            product.productId.price)
        });
        pdfDoc.fontSize(20).text('Total Price'+'='+'$'+totalPrice)
        pdfDoc.end()
        // fs.readFile(invoicePath,(err,data)=>{
        //   if(err){
        //     return next(err);
        //   }
        //   res.setHeader('Content-Type','application/pdf')
        //   res.setHeader('Content-Disposition',`inline;filename=${invoicePath}`);
        //   res.send(data);
        // })
        // const file=fs.createReadStream(invoicePath)
        // res.setHeader('Content-Type','application/pdf')
        // res.setHeader('Content-Disposition',`inline;filename=${invoicePath}`)
        // file.pipe(res)
      })
      .catch(err=>next(err))
  }