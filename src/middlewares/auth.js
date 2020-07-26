const jwt= require('jsonwebtoken')
const authConfig = require("../config/auth.json")

module.exports=(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.json(({"error":'SEM TOKEN',"status":"401"}))
    }

    const parts = authHeader.split(' ');
    
    if(!parts.length===2)
    {
        return res.json(({"error":'ERRO NO FORMATO DO TOKEN',"status":"401"}))
    }
    const[scheme,token]=parts

    if(!/^Bearer$/i.test(scheme))
    {
        return res.json(({"error":'ERRO NO FORMATO DO TOKEN',"status":"401"}))
    }

    jwt.verify(token,authConfig.secret,(err,decoded)=>{
        if(err)
        {
            return res.json(({"error":'TOKEN INVALIDO',"status":"401"}))
        }
        req.userId=decoded.id;
        return next()
    })
}