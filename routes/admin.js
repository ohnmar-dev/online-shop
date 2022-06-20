const express=require('express')

const adminController=require('../controllers/adminController')

const path=require('path')
const router=express.Router();

//admin/add-product =>GET
router.get('/add-product',adminController.getController)

// adim/add-product=>POST
router.post('/add-product',adminController.postController)


//admin/edit=>(GET)
router.get('/edit/:productId',adminController.getEditProduct)

//admin/edit=>(POST)
router.post('/edit',adminController.postEditProduct)


//admin/products => GET
router.get('/products',adminController.getProducts);

 
//delete product
router.post('/delete-product',adminController.postDeleteController)
module.exports=router;
