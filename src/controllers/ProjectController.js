const express = require('express')
const authMiddleware = require("../middlewares/auth")

const CheckRouter = express.Router();

CheckRouter.use(authMiddleware)

CheckRouter.get('/',(req,res)=>{
    res.send({ok:true});
});

module.exports=app=>app.use('/check',CheckRouter);