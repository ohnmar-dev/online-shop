const Product=require('../models/productModel')
//const {ObjectId}=require('mongodb')

exports.getController=(req,res,next)=>{
    res.render('admin/edit', {
        pageTitle:"Add Product",
        path:'/admin/add-product',
        editing:false
    })
}
//get edit product
exports.getEditProduct=(req,res,next)=>{
    const editMode=req.query.edit //string (true)
    if(!editMode){
     return   res.redirect('/')
    }
    const prodId=req.params.productId;
    Product.findById(prodId)
    .then(product=>{
        if(!product){
            return res.render('/')
        }
        res.render('admin/edit', {
            pageTitle:"Edit Product",
            path:'/admin/edit',
            editing:editMode ,
            product:product
        })
    })
    .catch(err=>console.log(err))
   
}


// save data 
exports.postController=(req,res,next)=>{
    const title=req.body.title;
    const image=req.body.image;
    const price=req.body.price;
    const description=req.body.description;

    const product=new Product(title,
        image,
        price,
        description,
        null,
        req.user._id
        )
    product.save()
    .then(result=>{
        console.log("Created product successfully!")
        res.redirect('/admin/products')
    })
    .catch(err=>{
        console.log(err)
    })
    res.redirect('/');

}
//post edit product
exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updateTitle=req.body.title;
    const updateImage=req.body.image;
    const updatePrice=req.body.price;
    const updateDescription=req.body.description;   

    const updateProduct=new Product(
       
        updateTitle,
        updateImage,
        updatePrice,
        updateDescription,
        //new ObjectId(prodId)
        prodId
    );
    updateProduct.save();
    res.redirect('/admin/products')
}
exports.getProducts=(req,res,next)=>{
   Product.fetchAll()
   .then(products=>{
    res.render('admin/product', {
        prods:products,
        pageTitle:"Admin Product",
        path:'/admin/products'
       
    })
   })
   .catch(err=>{
    console.log(err)
   })

}

//delete controller
exports.postDeleteController=(req,res,next)=>{
 const prodId=req.body.productId;
    Product.deleteById(prodId)
    .then(result=>{
        res.redirect('/admin/products')

    })
    .catch(err=>console.log(err))
        
    
}
    
