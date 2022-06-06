const express=require('express')
const router=express.Router();
const getController=require('../controllers/productController')


router.get('/',getController.shopController)
module.exports=router;