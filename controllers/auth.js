const User=require('../models/user')
const bcryptjs=require('bcryptjs')
exports.getLogin = (req, res, next) => {
  // const loggedIn=req.get('Cookie').split('=')[1] ==='true';
  // console.log(loggedIn)
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:false,
      errorMessage: req.flash('error')
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
    res.render('auth/signUp',{
        path:'/signUp',
        pageTitle:'SignUp',
        isAuthenticated:false

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
              res.redirect('/login')
            })
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