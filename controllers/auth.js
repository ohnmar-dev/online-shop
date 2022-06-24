const User=require('../models/user')
exports.getLogin = (req, res, next) => {
  // const loggedIn=req.get('Cookie').split('=')[1] ==='true';
  // console.log(loggedIn)
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:false
    });
  };
  
exports.postLogin=(req,res,next)=>{
    User.findById('62afded3e350f55ace827fa0')
        .then((user)=>{
          req.session.isLoggedIn=true;
          req.session.user=user;
          req.session.save((err)=>{
            console.log(err)
            res.redirect('/')
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