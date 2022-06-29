const Product=require('../models/productModel')


exports.getController=(req,res,next)=>{
    res.render('admin/edit', {
        pageTitle:"Add Product",
        path:'/admin/add-product',
        editing:false,
       

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
            product:product,
           
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
    const product=new Product({
        title:title,
        image:image,
        price:price,
        description:description,
        userId:req.user
    })
     
    product.save()
    .then(()=>{
        console.log("Created product successfully!")
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err))

}
//post edit product
exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updateTitle=req.body.title;
    const updateImage=req.body.image;
    const updatePrice=req.body.price;
    const updateDescription=req.body.description;   

    Product.findById(prodId)
            .then(product=>{
                product.title=updateTitle;
                product.image=updateImage;
                product.price=updatePrice;
                product.description=updateDescription;
                return product.save()
            })
            .then(()=>{
                console.log("update product")
                res.redirect('/admin/products')
            })
            .catch(err=>console.log(err))

   
}
exports.getProducts=(req,res,next)=>{
   Product.find()
//    .select(' price image -_id')
//    .populate('userId','name')
   .then(products=>{ 
    res.render('admin/product', {
        prods:products,
        pageTitle:"Admin Product",
        path:'/admin/products',
       
       
    })
   })
   .catch(err=>{
    console.log(err)
   })

}

//delete controller
exports.postDeleteController=(req,res,next)=>{
 const prodId=req.body.productId;
    Product.findByIdAndRemove(prodId)
    .then(result=>{
        console.log("delete successfully!")
        res.redirect('/admin/products')

    })
    .catch(err=>console.log(err))
        
    
}
    
