const express=require('express')

const adminController=require('../controllers/adminController')
const isAuth=require('../middleware/is-Auth')


const path=require('path')
const router=express.Router();

//admin/add-product =>GET
router.get('/add-product',isAuth, adminController.getController)

// adim/add-product=>POST
router.post('/add-product',isAuth, adminController.postController)


//admin/edit=>(GET)
router.get('/edit/:productId',isAuth, adminController.getEditProduct)

//admin/edit=>(POST)
router.post('/edit',isAuth, adminController.postEditProduct)


//admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

 
//delete product
router.post('/delete-product',isAuth, adminController.postDeleteController)
module.exports=router;
