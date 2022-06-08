const express=require('express')
const router=express.Router();
const shopController=require('../controllers/shopController')

//normal route | specific route
router.get('/',shopController.getIndex)

router.get('/products',shopController.getProducts)

//dynamic segment
router.get('/products/:productId',shopController.getDetail)

router.get('/cart',shopController.getCart)

//post method
router.post('/cart',shopController.postCart)

router.get('/orders',shopController.getOrder)

router.get('/checkout',shopController.getCheckout)

module.exports=router;