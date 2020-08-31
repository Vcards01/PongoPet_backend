const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const authConfig = require("../config/auth.json");
const emailExistence = require('email-existence')
const nodemailer = require("nodemailer")
const SMTP_CONFIG = require('../config/mail.json')
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

const Cliente = require("../models/Cliente");
const PetShop = require("../models/PetShop");




module.exports={
    async store(req,res){
        const {name} = req.body;
        const {email} = req.body;
        const {password} = req.body;
        const {type} = req.body;
        let check
        let user

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        switch(type) {
            case 'cliente':
                user= await Cliente.findOne({email});
                if (!user){
                    emailExistence.check(email, function(error, response){check=response})
                    await sleep(3000);
                    if(check){
                        user = await Cliente.create({name,email,password})
                        const token = jwt.sign({id:user.id},authConfig.secret,{
                            expiresIn:1800,
                        })
                        await transporter.sendMail({
                            html:`
                            <htm>
                                <body>
                                    <h3>Olá ${name}, bem vindo ao PongoPet</h3><br/>
                                    <p>Para concluir seu cadastro, confirme seu email</p><br/>
                                    <a href=${process.env.FRONTEND_URL}/verify/token?${token}email?${email}type?${type}>Confirmar</a>
                                </body>
                            </html>
                            `,
                            subject:"Cadastro PongoPet",
                            from: "Suporte PongoPet <suportepongopet@gmail.com>",
                            to: email
                        })
                    }
                    else{
                        return res.json(({"error":'Email invalido',"status":"400"}))
                    }

                }
                else{
                    return res.json(({"error":'USUARIO JÁ CADASTRADO',"status":"400"}))
                }
                break;
            case 'petshop':
                const {petshop_name}= req.body;
                const {contact}=req.body;
                user = await PetShop.findOne({email});
                if (!user){
                    emailExistence.check(email, function(error, response){check=response})
                    await sleep(3000);
                    if(check){
                        user = await PetShop.create({name,email,password,petshop_name,contact})
                        const token = jwt.sign({id:user.id},authConfig.secret,{
                            expiresIn:1800,
                        })
                        await transporter.sendMail({
                            html:`
                            <htm>
                                <body>
                                    <h3>Olá ${name},estamos felizes do ${petshop_name} estar agora no PongoPet</h3><br/>
                                    <p>Para concluir seu cadastro, confirme seu email</p><br/>
                                    <a href=${process.env.FRONTEND_URL}/verify/token?${token}email?${email}type?${type}>Confirmar</a>
                                </body>
                            </html>
                            `,
                            subject:"Cadastro PongoPet",
                            from: "Suporte PongoPet <suportepongopet@gmail.com>",
                            to: email
                        })
                    }
                    else{
                        return res.json(({"error":'Email invalido',"status":"400"}))
                    }
                }
                else{
                    return res.json(({"error":'USUARIO JÁ CADASTRADO',"status":"400"}))
                }
                break;
            default:
                return res.json(({"error":'ERRO COM O TIPO DE USUARIO',"status":"400"}))
        }
        user.password=undefined;
        return res.json({user})
    }, 
     
    async update(req,res){
        const{email}=req.body;
        const{name}=req.body;
        const{type} = req.body;
        const {id} = req.body;
        const{password}=req.body
        const{contact}=req.body
        const{petName}=req.body
        var newPassword
        if(!req.body.newPassword){
            newPassword=req.body.password
        }
        else{
            newPassword=req.body.newPassword
        }
        let user;
        switch(type) {
            case 'cliente':
                user= await Cliente.findOne({_id:id}).select("+password");
                break;
            case 'petshop':
                user= await PetShop.findOne({_id:id}).select("+password");
                break;
        }
        if (!user){
            return res.json(({"error":'USUARIO NÃO EXISTE',"status":"400"}))
        }
        if(!await bcrypt.compare(password,user.password))
        {
            return res.json(({"error":'SENHA INCORRETA',"status":"400"}))
        }
        else{
            const hash = await bcrypt.hash(newPassword,10);
            newPassword=hash;
            switch(type) {
                case 'cliente':
                    await Cliente.updateOne({_id:id},{$set: {name:name,email:email,password:newPassword}});
                    break;
                case 'petshop':
                    await PetShop.updateOne({_id:id},{$set: {name:name,email:email,password:newPassword,contact:contact,petshop_name:petName}});
                    break;
            }
        }
        return res.json({"ok":true})
    },

}
