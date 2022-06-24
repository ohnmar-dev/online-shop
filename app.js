
const mongoogse=require('mongoose')
const express=require('express');
const bodyParser=require('body-parser')
const path=require('path')
const app=express();
const session=require('express-session')
const MongodbStore=require('connect-mongodb-session')(session)
const User=require('./models/user')

app.set('view engine', 'ejs')
app.set('views','views');

const adminRouters=require('./routes/admin')
const shopRouter=require('./routes/shop')
const authRoutes=require('./routes/auth')
const errorController=require('./controllers/errorController')
const MONGODB_URI='mongodb+srv://root:root@cluster0.gkh0oe5.mongodb.net/online-shop?retryWrites=true&w=majority'
//for connect-mongodb-sesssion
const store=new MongodbStore({
    uri:MONGODB_URI,
    collection:'sessions'
})

//for expression session
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    store:store
    // cookie:{maxAge}
}))

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

app.use(bodyParser.urlencoded({extended:false}))
app.use('/admin',adminRouters)
app.use(shopRouter)
app.use(authRoutes);

app.use(express.static(path.join(__dirname,'public')))
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