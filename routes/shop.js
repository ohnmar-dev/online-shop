
const express=require('express')

const shopController=require('../controllers/shopController')
const isAuth=require('../middleware/is-Auth')

 const router=express.Router();
//normal route | specific route
router.get('/', shopController.getIndex)

router.get('/products', shopController.getProducts)

 //dynamic segment
 //product detail page
 router.get('/products/:productId',isAuth, shopController.getDetail)

router.get('/cart',isAuth, shopController.getCart)

// //post method
router.post('/cart',isAuth, shopController.postCart)

// //delete cart method
router.post('/delete-cart',isAuth, shopController.deleteCart)

// //for order post
router.post('/create-order',isAuth, shopController.postOrder)

router.get('/orders',isAuth, shopController.getOrder)

// router.get('/checkout',shopController.getCheckout)

// for invoice download
router.get('/orders/:orderId',isAuth, shopController.getInvoice)

module.exports=router;