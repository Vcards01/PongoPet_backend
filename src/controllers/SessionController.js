const Cliente = require("../models/Cliente");
const PetShop = require("../models/PetShop");
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const authConfig = require("../config/auth.json");
const nodemailer = require("nodemailer")
const SMTP_CONFIG = require('../config/mail.json');
const { update } = require("../models/Cliente");
const transporter = nodemailer.createTransport({
    host:SMTP_CONFIG.host,
    port:SMTP_CONFIG.port,
    secure:false,
    auth:{
        user:SMTP_CONFIG.user,
        pass:SMTP_CONFIG.pass,
    },
    tls:{
        rejectUnathorized:false,
    }
})

module.exports={
    
    async index(req,res){
        const{email}=req.body;
        const{password}=req.body
        const {type} = req.body;
        let user;
        switch(type) {
            case 'cliente':
                user= await Cliente.findOne({email}).select("+password");
                break;
            case 'petshop':
                user= await PetShop.findOne({email}).select("+password");
                break;
        }
        if (!user){
            return res.json(({"error":'USUARIO NÃO EXISTE',"status":"400"}))
        }
        if(!await bcrypt.compare(password,user.password))
        {
            return res.json(({"error":'SENHA INCORRETA',"status":"400"}))
        }
        if(!user.confirmed)
        {
            const token = jwt.sign({id:user.id},authConfig.secret,{
                expiresIn:1800,
            })
            await transporter.sendMail({
                html:`
                <htm>
                    <body>
                        <h3>Olá, bem vindo ao PongoPet</h3><br/>
                        <p>Para concluir seu cadastro, confirme seu email</p><br/>
                        <a href=${process.env.FRONTEND_URL}/verify/token?${token}email?${email}type?${type}>Confirmar</a>
                    </body>
                </html>
                `,
                subject:"Cadastro PongoPet",
                from: "Suporte PongoPet <suportepongopet@gmail.com>",
                to: email
            })
            return res.json(({"error":'USUARIO NÃO CONFIRMADO',"status":"400"}))
        }
        const token = jwt.sign({id:user.id},authConfig.secret,{
            expiresIn:10800,
        })
        user.password=undefined;
        return res.json({user,token})
    },

    async request_update(req,res){
        const{email}=req.body;
        const {type} = req.body;
        switch(type) {
            case 'cliente':
                user= await Cliente.findOne({email}).select("+password");
                break;
            case 'petshop':
                user= await PetShop.findOne({email}).select("+password");
                break;
        }
        if (!user){
            return res.json(({"error":'USUARIO NÃO EXISTE',"status":"400"}))
        }
        if(!user.confirmed)
        {
            const token = jwt.sign({id:user.id},authConfig.secret,{
                expiresIn:1800,
            })
            await transporter.sendMail({
                html:`
                <htm>
                    <body>
                        <h3>Olá, bem vindo ao PongoPet</h3><br/>
                        <p>Para concluir seu cadastro, confirme seu email</p><br/>
                        <a href=${process.env.FRONTEND_URL}/verify/token?${token}email?${email}type?${type}>Confirmar</a>
                    </body>
                </html>
                `,
                subject:"Cadastro PongoPet",
                from: "Suporte PongoPet <suportepongopet@gmail.com>",
                to: email
            })
            return res.json(({"error":'USUARIO NÃO CONFIRMADO',"status":"400"}))
        }
        else{
            const token = jwt.sign({id:user.id},authConfig.secret,{
                expiresIn:300,
            })
            await transporter.sendMail({
                html:`
                <htm>
                    <body>
                        <h3>Olá, parece que você esqueceu sua senha,né?</h3><br/>
                        <p>Para mudar sua senha acesse o link a seguir</p><br/>
                        <a href=${process.env.FRONTEND_URL}/update_pass/token?${token}email?${email}type?${type}>Mudar senha</a><br/>
                        <p>Se você não solicitou mudança de senha,ignorar este email</p>
                    </body>
                </html>
                `,
                subject:"Mudança de senha PongoPet",
                from: "Suporte PongoPet <suportepongopet@gmail.com>",
                to: email
            })
            return res.json({"ok":true})
        }
    },

    async update(req,res){
        const token = req.body.token;
        const email = req.body.email;
        const type = req.body.type;
        var password = req.body.pass
        const hash = await bcrypt.hash(password,10);
        password=hash;
        let sucesse = false
        jwt.verify(token,authConfig.secret,(err,decoded)=>{
            if(err)
            {
                return res.json(({"error":'TOKEN INVALIDO',"status":"401"}))
            }
            else{
                sucesse=true
            }
        })
        if(sucesse)
        {
            switch(type) {
                case 'cliente':
                    await Cliente.updateOne({email:email},{$set: {password:password}});
                    break;
                case 'petshop':
                    await PetShop.updateOne({email:email},{$set: {password:password}});
                    break;
            }
            return res.json({"ok":true})
        }
    }
       
}