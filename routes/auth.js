const express = require('express');

const authController = require('../controllers/auth');
const {check}=require('express-validator')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',authController.postLogin)

//for post logout
router.post('/logout',authController.postLogout)

//for get signup
router.get('/signup',authController.getSignUp)

//for post signup
router.post('/signup',check('email').isEmail(),authController.postSignUp)

//for reset password
router.get('/reset',authController.getResetPassword)


//for post reset password
router.post('/reset',authController.postReset)


//for get newpassword
router.get('/reset/:token',authController.getNewPassword)

//for post newpassword
router.post('/new-password',authController.postNewPassword)
module.exports = router;