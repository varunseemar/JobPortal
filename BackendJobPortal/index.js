const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const authRouter = require("./routes/auth")
const jobRouter = require('./routes/job')
const authUserlogin = require('./middleware/authLogin')
const fs = require('fs')
const mongoose = require('mongoose')
const cors = require('cors')
const Port = process.env.PORT || 3000 ;

const app = express();
dotenv.config();
app.use(cors({
    origin:"*"
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use("/d1/auth",authRouter);
app.use('/d1/job', jobRouter)

app.use((req,res,next)=>{
    const requestString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFile('log.txt',requestString,{flag:'a'},(err)=>{
        if(err){
            console.log(err);
        }
    })
    next();
})

app.use((err,req,res,next)=>{
    const errorString = `${req.method} ${req.url} ${Date.now()}\n`
    fs.writeFile('error.txt',errorString,{flag:'a'},(err)=>{
        if(err){
            console.log(err);
        }
    })
    res.status(500).send("Something went wrong");
    next();
})



app.get('/',(req,res)=>{
    res.send('Home')
})

app.listen(Port,()=>{
    mongoose.connect(process.env.MONGOOSE_URL)
    .then(()=>{
        console.log("DB Connected...")
    })
    .catch((err)=>{
        console.log(err)
    })
    console.log("Server Started...")
})