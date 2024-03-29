const User=require('../models/user')
const bcryptjs=require('bcryptjs')
const nodemailer=require('nodemailer');
const crypto=require('crypto')
const {validationResult}=require('express-validator')


var transport = nodemailer.createTransport({
  service: "hotmail",
  auth: {
      user: "jokerchay588981@outlook.com",
      pass: "ohnmar12232@"
  }
});


exports.getLogin = (req, res, next) => {
  let message=req.flash('error');
  if(message.length>0){
    message=message[0];
  }else{
    message=null;
  }
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:false,
      errorMessage: message,
       // for old input
       oldInput:{
        email:'',
        password:''
      },
      // for error red boder
      validationError:[]

    });
  };
  
exports.postLogin=(req,res,next)=>{
   const email=req.body.email;
   const password=req.body.password;
   const errors=validationResult(req);
   if(!errors.isEmpty()){
      return res.status(422).render('auth/login',{
          path:'/login',
          pageTitle:'Login',
          errorMessage:errors.array()[0].msg,
          // for old input
          oldInput:{
            email:email,
            password:password
          },
          // for error red boder
          validationError:errors.array()

      })
   }
   User.findOne({email:email})
        .then(user=>{
          if(!user){
            return res.status(422).render('auth/login',{
              path:'/login',
              pageTitle:'Login',
              errorMessage:"Invalid email or password",
              // for old input
              oldInput:{
                email:email,
                password:password
              },
              // for error red boder
              validationError:[]
    
          })
          }
          bcryptjs.compare(password,user.password)
                  .then(doMatch=>{
                    if(doMatch){

                      req.session.isLoggedIn=true;
                      req.session.user=user;
                      return req.session.save(err=>{
                        console.log(err);
                         res.redirect('/')
                    })
                        }
                        return res.status(422).render('auth/login',{
                          path:'/login',
                          pageTitle:'Login',
                          errorMessage:"Invalid email or password",
                          // for old input
                          oldInput:{
                            email:email,
                            password:password
                          },
                          // for error red boder
                          validationError:[]
                
                      })
                  })
                  .catch(err=>{
                    console.log(err)
                    res.redirect('/login')
                  })
        })
        .catch(err=>{
          const error=new Error(err)
          error.httpStatusCode=500;
          return next(error);
      })
       
}

//for getSignUp
exports.getSignUp=(req,res,next)=>{
  let message=req.flash('error');
  if(message.length>0){
    message=message[0];
  }else{
    message=null;
  }
    res.render('auth/signUp',{
        path:'/signUp',
        pageTitle:'SignUp',
        isAuthenticated:false,
        errorMessage:message,
        oldInput:{
          email:'',
          password:'',
          confirmPassword:''
        },
        validatinErrors:[]

    })
     
}
//for postSignUp
exports.postSignUp=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors.array())
      return res.status(422).render('auth/signUp',{
        path:'/signUp',
        pageTitle:'SignUp',
        errorMessage:errors.array()[0].msg,
        oldInput:{
          email:email,
          password:password,
          confirmPassword:confirmPassword
        },
        validatinErrors:errors.array()
      })
    }
   
        bcryptjs.hash(password,12)
            .then((hashedPassword)=>{
              const user=new User({
                email:email,
                password:hashedPassword,
                cart:{items:[]}
              })
              
              user.save()
            })
            .then(()=>{
              res.redirect('/login');
              transport.sendMail({
                from:'jokerchay588981@outlook.com',
                to:email,
                subject:'Success Singn Up',
                html:'<h1>You are successfully singn up</h1>'
              })
            })
            .catch(err=>{
              const error=new Error(err)
              error.httpStatusCode=500;
              return next(error);
          })
     
}
//for post logout
exports.postLogout=(req,res,next)=>{
  req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
  })
}


exports.getResetPassword=(req,res,next)=>{
  let message=req.flash('error')
  if(message.length>0){
    message=message[0]
  }else{
    message=null;
  }
  res.render('auth/reset',{
    path:'/reset',
    pageTitle: 'Reset Password',
    errorMessage:message

  })
}

//for reset password
exports.postReset=(req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      return res.redirect('/reset')
    }
    const token=buffer.toString('hex')
    User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
              req.flash('error','No account with the email found');
              return res.redirect('/reset');
            }
            user.resetToken=token;
            user.resetTokenExpiration=Date.now()+3600000;
            return user.save();
           
        })
          .then(()=>{
            res.redirect('/')
            transport.sendMail({
              from:'jokerchay588981@outlook.com',
              to:req.body.email,
              subject:'Reset Password',
              html:`
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a></p>
              `
            })
          })
          .catch(err=>{
            const error=new Error(err)
            error.httpStatusCode=500;
            return next(error);
        })
  })
}

//for new password
exports.getNewPassword=(req,res,next)=>{
  const token=req.params.token;
    User.findOne({resetToken:token,resetTokenExpiration: {$gt:Date.now()}})
        .then(user=>{
            let message=req.flash('error')
            if(message.length>0){
              message=message[0]
            }else{
              message=null;
            }
            res.render('auth/new-password',{
              path:'/new-password',
              pageTitle:'New Password',
              errorMessage:message,
              userId:user._id.toString(),
              passwordToken:token
            })
        })
        .catch(err=>{
          const error=new Error(err)
          error.httpStatusCode=500;
          return next(error);
      })

   
}
exports.postNewPassword=(req,res,next)=>{
    const newPassword=req.body.password;
    const userId=req.body.userId;
    const passwordToken=req.body.passwordToken;
      User.findOne({
      resetToken:passwordToken,
      resetTokenExpiration:{$gt:Date.now()},
      _id:userId
    })
    .then(user=>{
      newUser=user;
      return bcryptjs.hash(newPassword,12)
    })
    .then(hashedPassword=>{
      newUser.password=hashedPassword;
      newUser.resetToken=undefined;
      newUser.resetTokenExpiration=undefined;
     return newUser.save();

    })
    .then(()=>{
      res.redirect('/login')
    })
    .catch(err=>{
      const error=new Error(err)
      error.httpStatusCode=500;
      return next(error);
  })
}