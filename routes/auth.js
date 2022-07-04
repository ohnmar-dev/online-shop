const express = require('express');

const authController = require('../controllers/auth');
const {check,body}=require('express-validator');
const User=require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',authController.postLogin)

//for post logout
router.post('/logout',authController.postLogout)

//for get signup
router.get('/signup',authController.getSignUp)

//for post signup
router.post('/signup',[
check('email')
    .isEmail()
    .withMessage('Please enter your valid value')
    .custom((value,{req})=>{
        // if(value==='test@test.com'){
        //     throw new Error('The email address is forbidden')
        // }
        // return true;
        return User.findOne({email:value})
            .then(userDoc=>{
                if(userDoc){
                 return Promise.reject('Email already exist, but pick other email')
                }
            })

}),
body(
    'password',
    'Please enter password must be only number and text  at least 6 characters'
)
    .isLength({min:6,max:18})
    .isAlphanumeric(),
body('confirmPassword')
    .custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Passwords have not match')
        }
        return true;
    })

],
                
authController.postSignUp)

//for reset password
router.get('/reset',authController.getResetPassword)


//for post reset password
router.post('/reset',authController.postReset)


//for get newpassword
router.get('/reset/:token',authController.getNewPassword)

//for post newpassword
router.post('/new-password',authController.postNewPassword)
module.exports = router;