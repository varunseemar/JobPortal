const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const authUserlogin = async (req,res,next)=>{
    const token = req.headers['authorization'];
    if(!token){
        return res.status(402).send("Denides Access")
    }
    try{
        const verifiedToken = jwt.verify(token,process.env.JWTOKEN)
        if(verifiedToken){
            req.user = verifiedToken;
            next();
        }
    }
    catch(err){
        return res.status(400).send("Invalid Token");
    }
    
}

module.exports = authUserlogin;