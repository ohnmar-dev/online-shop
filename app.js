const mongoConnect=require('./util/database').mongoConnect

const express=require('express');
const bodyParser=require('body-parser')
const path=require('path')
const app=express();

app.set('view engine', 'ejs')
app.set('views','views');

const adminRouters=require('./routes/admin')
const shopRouter=require('./routes/shop')
const errorController=require('./controllers/errorController')


app.use(bodyParser.urlencoded({extended:false}))
app.use('/admin',adminRouters)
app.use(shopRouter)

app.use(express.static(path.join(__dirname,'public')))
app.use(errorController.getError)



mongoConnect(()=>{
    app.listen(3000);
    console.log("sever is running in port 3000")
        
})