
const mongoogse=require('mongoose')
const express=require('express');
const bodyParser=require('body-parser')
const path=require('path')
const app=express();

const User=require('./models/user')

app.set('view engine', 'ejs')
app.set('views','views');

const adminRouters=require('./routes/admin')
const shopRouter=require('./routes/shop')
const errorController=require('./controllers/errorController')

app.use((req, res, next)=> {
    User.findById('62ac7d612bf3d05201e719a5')
        .then(user => {
            req.user =user;
            next()
        })
        .catch(err=>console.log(err))
})

app.use(bodyParser.urlencoded({extended:false}))
app.use('/admin',adminRouters)
app.use(shopRouter)

app.use(express.static(path.join(__dirname,'public')))
app.use(errorController.getError)



mongoogse.connect(
    'mongodb+srv://root:root@cluster0.gkh0oe5.mongodb.net/online-shop?retryWrites=true&w=majority',
    {useNewUrlParser:true, useUnifiedTopology:true}
    
)
.then(()=>{
    User.findOne().then(user=>{
        if(!user){
            const user=new User({
                name:'pone pone',
                email:'pone@gmail.com',
                cart:{
                    item:[]
                }
            })
            user.save();
        }
    })
   
    console.log("Connected !")
    app.listen(3000);
})
.catch(err=>console.log(err))