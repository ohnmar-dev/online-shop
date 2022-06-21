const express=require('express')

const shopController=require('../controllers/shopController')

 const router=express.Router();
//normal route | specific route
router.get('/',shopController.getIndex)

router.get('/products',shopController.getProducts)

 //dynamic segment
 //product detail page
 router.get('/products/:productId',shopController.getDetail)

router.get('/cart',shopController.getCart)

// //post method
router.post('/cart',shopController.postCart)

// //delete cart method
router.post('/delete-cart',shopController.deleteCart)

// //for order post
router.post('/create-order',shopController.postOrder)

router.get('/orders',shopController.getOrder)

// router.get('/checkout',shopController.getCheckout)

module.exports=router;