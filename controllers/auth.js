const User=require('../models/user')
const bcryptjs=require('bcryptjs')
const nodemailer=require('nodemailer');

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
      errorMessage: message
    });
  };
  
exports.postLogin=(req,res,next)=>{
   const email=req.body.email;
   const password=req.body.password;
   User.findOne({email:email})
        .then(user=>{
          if(!user){
            req.flash('error','Invaild email or password')
            return res.redirect('/login')
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
                        req.flash('error','Invaild email or password')
                         res.redirect('/login')
                  })
                  .catch(err=>{
                    console.log(err)
                    res.redirect('/login')
                  })
        })
        .catch(err=>console.log(err))
       
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
        errorMessage:message

    })
     
}
//for postSignUp
exports.postSignUp=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    User.findOne({email:email})
      .then((userDoc)=>{
        if(userDoc){
          req.flash('error','Email already exist, but pick other email')
          return res.redirect('/signup')
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
            .catch(err=>console.log(err))
      })
      
      .catch(err=>console.log(err))
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