const express = require('express')
const User = require('../schemas/user.schema')
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require("jsonwebtoken") 

router.post('/Register', async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).send("User already Exists.")
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        const user = new User({
            name,
            email,
            password:hashPassword,
        });
        await user.save();
        res.status(200).send('Successful')

    }
    catch(err){
        throw new Error(err.message);
    }

})

router.post('/Login', async (req,res)=>{
    try{
        const {email,password} = req.body;
        const userExist = await User.findOne({email})
        
        if(!userExist){
            return res.status(400).send("Wrong Email or Password")
        }
        const validPass = bcrypt.compareSync(password,userExist.password)
        if(!validPass){
            return res.status(400).send("Wrong Email or Password")
        }
        const token = jwt.sign({_id:userExist._id},process.env.JWTOKEN);
        res.status(200).json({
            name:userExist.name,
            email:userExist.email,
            token,
        })

    }
    catch(err){
        throw new Error(err.message);
    }

})

router.post('/updatePassword',async(req,res)=>{
    try{
        const {email,password,newPassword} = req.body;
        const token = req.headers['authorization']
        //const token = authHeader && authHeader.split(' ')[1]
        const userExist = await User.findOne({email})
        
        if(!userExist){
            return res.status(400).send("Wrong Email or Password")
        }
        const validPass = bcrypt.compareSync(password,userExist.password)
        if(!validPass){
            return res.status(400).send("Wrong Email or Password")
        }
        const verifyToken = jwt.verify(token,process.env.JWTOKEN);
        const userId = userExist._id.toString()
        if(verifyToken._id !== userId){
            return res.status(401).send("Unauthorized")
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword,salt);
        await User.findOneAndUpdate({email:userExist.email},{password:hashPassword})
        res.send("Password Updated")

    }
    catch(err){
        throw new Error(err.message);
    }
})

module.exports = router;