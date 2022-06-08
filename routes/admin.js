const express=require('express')

const adminController=require('../controllers/adminController')

const router=express.Router();

//admin/add-product =>GET
router.get('/add-product',adminController.getController)

//admin/edit-product
router.get('/edit/:productId',adminController.getEditProduct)

//admin/products => GET
router.get('/products',adminController.getProducts);

// adim/add-product=>POST
router.post('/add-product',adminController.postController)


module.exports=router;
