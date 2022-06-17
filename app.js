
const mongoogse=require('mongoose')
const express=require('express');
const bodyParser=require('body-parser')
const path=require('path')
const app=express();

// const User=require('./models/user')

app.set('view engine', 'ejs')
app.set('views','views');

const adminRouters=require('./routes/admin')
const shopRouter=require('./routes/shop')
const errorController=require('./controllers/errorController')

// app.use((req, res, next)=> {
//     User.findById('62a41c7b02cb100923a7506f')
//         .then(user => {
//             req.user =new User(user.name,user.email,user.cart,user._id);
//             next()
//         })
//         .catch(err=>console.log(err))
// })

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
    app.listen(3000);
})
.catch(err=>console.log(err))