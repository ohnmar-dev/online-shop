const Product=require('../models/productModel')

exports.getController=(req,res,next)=>{
    res.render('admin/add-product', {
        pageTitle:"Add Product",
        path:'/admin/add-product',
    })
    }
// save data 
exports.postController=(req,res,next)=>{
    const title=req.body.title;
    const image=req.body.image;
    const price=req.body.price;
    const description=req.body.description;

    const product=new Product(title,image,price,description)
    console.log(product)
    product.save();
    res.redirect('/');

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