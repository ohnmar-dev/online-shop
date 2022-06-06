const express=require('express')
const productController=require('../controllers/productController')

const router=express.Router();
router.get('/add-product',productController.getController)

router.post('/add-product',productController.postController)

module.exports=router;
