
const mongoogse=require('mongoose')
const express=require('express');
const bodyParser=require('body-parser')
const path=require('path')
const session=require('express-session')
const MongodbStore=require('connect-mongodb-session')(session)
const csrf=require('csurf');
const csrfProtection = csrf();
const flash= require('connect-flash')

const errorController=require('./controllers/errorController')
const User=require('./models/user')

const MONGODB_URI='mongodb+srv://root:root@cluster0.gkh0oe5.mongodb.net/online-shop?retryWrites=true&w=majority'

const app=express();
const store=new MongodbStore({
    uri:MONGODB_URI,
    collection:'sessions'
})

app.set('view engine', 'ejs')
app.set('views','views');

const adminRouters=require('./routes/admin')
const shopRouter=require('./routes/shop')
const authRoutes=require('./routes/auth')

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))


//for expression session
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store:store
    // cookie:{maxAge}
}))

//for csrf toker
app.use(csrfProtection);
app.use(flash());


app.use((req, res, next)=> {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next()
            
        })
        .catch(err=>console.log(err))
})

//for csrf token
app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });
  
app.use('/admin',adminRouters)
app.use(shopRouter)
app.use(authRoutes);

app.use(errorController.getError)



mongoogse.connect(
    MONGODB_URI,
    {useNewUrlParser:true, useUnifiedTopology:true}
    
)
.then(()=>{
    console.log("Connected !")
    app.listen(3000);
})
.catch(err=>console.log(err))