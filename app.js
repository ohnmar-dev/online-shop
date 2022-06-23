
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
const MONGO_URI='mongodb+srv://root:root@cluster0.gkh0oe5.mongodb.net/online-shop?retryWrites=true&w=majority'
//for connect-mongodb-sesssion
const store=new MongodbStore({
    uri:MONGO_URI,
    collection:'session'
})

//for expression session
app.use(session({
    secret:'my secret',
    resave:false,
    saveUninitialized:false,
    newstore:store
    // cookie:{maxAge}
}))

app.use((req, res, next)=> {
    User.findById('62afded3e350f55ace827fa0')
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
    uri,
    {useNewUrlParser:true, useUnifiedTopology:true}
    
)
.then(()=>{
    User.findOne().then(user=>{
        if(!user){
            const newuser=new User({
                name:'pone pone',
                email:'pone@gmail.com',
                cart:{
                    items:[]
                }
            })
            newuser.save();
        }
    })
   
    console.log("Connected !")
    app.listen(3000);
})
.catch(err=>console.log(err))