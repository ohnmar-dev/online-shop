const Product=require('../models/productModel')

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
    Product.findById(prodId,(product)=>{
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
   
}


// save data 
exports.postController=(req,res,next)=>{
    const title=req.body.title;
    const image=req.body.image;
    const price=req.body.price;
    const description=req.body.description;

    const product=new Product(null, title,image,price,description)
    product.save();
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
        prodId,
        updateTitle,
        updateImage,
        updatePrice,
        updateDescription
    );
    updateProduct.save();
    res.redirect('/admin/products')
}
exports.getProducts=(req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/product',{
            prods:products,
            pageTitle:"Admin Product",
            path:'/admin/products'
        })

    })
}

    
