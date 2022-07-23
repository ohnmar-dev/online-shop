
const mongoogse=require('mongoose')
const express=require('express');
const bodyParser=require('body-parser')
const path=require('path')
const session=require('express-session')
const MongodbStore=require('connect-mongodb-session')(session)
const csrf=require('csurf');
const csrfProtection = csrf();
const flash= require('connect-flash')
const multer=require('multer')
const uuid4=require('uuid')

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

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images')
    },
    filename:(req,file,cb)=>{
        cb(null,uuid4.v4() +'-'+file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(
        file.mimetype==='image/png' ||
        file.mimetype==='image/jpg' ||
        file.mimetype==='image/jpeg' 
    ){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
app.use(bodyParser.urlencoded({extended:false}))
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))



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


//for csrf token
app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });
  
app.use((req, res, next)=> {
   
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            // throw new Error('Dummy')
            if(!user){
                return next()
            }
            req.user = user;
            next()
            
        })
        .catch(err=>{
            next(new Error(err));
        }
            )
})

app.use('/admin',adminRouters)
app.use(shopRouter)
app.use(authRoutes);

app.get('/500',errorController.get500)
app.use(errorController.getError)
app.use((error,req,res,next)=>{
    // res.redirect('/500')
    res.status(500).render('500',{
        pageTitle:'ERROR!',
        path:'/500',
        isAuthenticated:req.session.isLoggedIn
    })
})


mongoogse.connect(
    MONGODB_URI,
    {useNewUrlParser:true, useUnifiedTopology:true}
    
)
.then(()=>{
    console.log("Connected !")
    app.listen(3000);
})
.catch(err=>console.log(err))