exports.getLogin = (req, res, next) => {
  const loggedIn=req.get('Cookie').split('=')[1];
  console.log(loggedIn)
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated:loggedIn
    });
  };
  
exports.postLogin=(req,res,next)=>{
    //req.isLoggedIn=true;
    res.setHeader('Set-Cookie','loggedIn=true')
    res.redirect('/')
}