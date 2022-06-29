const { model } = require( "mongoose" );

module.exports = (req, res, next)=>{
     if(!req.session.isLoggedIn){
          return res.redirect('/login');
     }
     next();
}