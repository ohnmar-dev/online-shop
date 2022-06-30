const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',authController.postLogin)

//for post logout
router.post('/logout',authController.postLogout)

//for get signup
router.get('/signup',authController.getSignUp)

//for post signup
router.post('/signup',authController.postSignUp)

//for reset password
router.get('/reset',authController.getResetPassword)

module.exports = router;