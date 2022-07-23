const Product=require('../models/productModel')
const {validationResult}=require('express-validator')
const { update } = require('../models/productModel')
const fileHelper=require('../util/file')

exports.getController=(req,res,next)=>{
    res.render('admin/edit', {
        pageTitle:"Add Product",
        path:'/admin/add-product',
        editing:false,
        hasError:false,
        errorMessage:null,
        validationErrors:[]

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
            hasError:false,
            errorMessage:null,
            validationErrors:[]
           
        })
    })
    .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500;
        return next(error);
    })
   
}


// save data 
exports.postController=(req,res,next)=>{
    const title=req.body.title;
    const image=req.file;
    const price=req.body.price;
    const description=req.body.description;
    const errors=validationResult(req);

    if(!image){
        res.status(422).render('admin/edit',{
            pageTitle:"Add Product",
            path:'/admin/add-product',
            editing:false,
            hasError:true,
            product:{
                title:title,
                price:price,
                description:description,
                

            },
            errorMessage:"do not match image",
            validationErrors:[]
        })
    }
    
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('admin/edit',{
            pageTitle:"Add Product",
            path:'/admin/edit',
            editing:false,
            hasError:true,
            product:{
                title:title,
                image:image,
                price:price,
                description:description,
                

            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()

        })
    }
    const imageUrl=image.path
    const product=new Product({
        title:title,
        image:imageUrl,
        price:price,
        description:description,
        userId:req.user
    })
     
    product.save()
    .then(()=>{
        console.log("Created product successfully!")
        res.redirect('/admin/products')
    })
    .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500;
        return next(error);
    })

}
//post edit product
exports.postEditProduct=(req,res,next)=>{
    const prodId=req.body.productId;
    const updateTitle=req.body.title;
    const updateImage=req.file;
    const updatePrice=req.body.price;
    const updateDescription=req.body.description;  
    const errors=validationResult(req);
    
    if(!errors.isEmpty()){
        console.log(errors.array())
        return res.status(422).render('admin/edit',{
            pageTitle:"Edit  Product",
            path:'/admin/edit',
            editing:true,
            hasError:true,
            product:{
                title:updateTitle,
                price:updatePrice,
                description:updateDescription,
                _id:prodId
                
 
            },
            errorMessage:errors.array()[0].msg,
            validationErrors:errors.array()


        })
    }

    Product.findById(prodId)
            
            .then(product=>{
                if(product.userId.toString() !== req.user._id.toString()){
                    return  res.redirect('/')
                  }
                product.title=updateTitle;
                if(updateImage){
                    fileHelper.deleteFile(product.image)
                    product.image=updateImage.path;

                }
                product.price=updatePrice;
                product.description=updateDescription;
                return product.save()
                .then(()=>{
                    console.log("update product")
                    res.redirect('/admin/products')
                })
            })
            
            .catch(err=>{
                const error=new Error(err)
                error.httpStatusCode=500;
                return next(error);
            })

   
}
exports.getProducts=(req,res,next)=>{
    
    Product.find({userId:req.user._id})
   .then(products=>{ 
    res.render('admin/product', {
        prods:products,
        pageTitle:"Admin Product",
        path:'/admin/products',
       
       
    })
   })
   .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500;
    return next(error);
})

}

//delete controller
exports.postDeleteController=(req,res,next)=>{
 const prodId=req.body.productId;
    Product.findById(prodId)
        .then(product=>{
            if(!product){
                return next(new Error('Product not Found'))
            }
            fileHelper.deleteFile(product.image)
            return Product.deleteOne({_id:prodId,userId:req.user._id})
        })
        
        .then(result=>{
            console.log("delete successfully!")
            res.redirect('/admin/products')

        })
        .catch(err=>{
            const error=new Error(err)
            error.httpStatusCode=500;
            return next(error);
        })     
    
}
    
