const Cliente = require("../models/Cliente");
const PetShop = require("../models/PetShop");

const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const authConfig = require("../config/auth.json");
const Item = require("../models/Item");

module.exports={
    async register(req,res){
        const {name} = req.body;
        const {email} = req.body;
        const {password} = req.body;
        const {type} = req.body;
        let user
        switch(type) {
            case 'cliente':
                 user= await Cliente.findOne({email});
                if (!user){
                    user = await Cliente.create({name,email,password})
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
                    user = await PetShop.create({name,email,password,petshop_name,contact})
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

    async athenticate(req,res){
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

        const token = jwt.sign({id:user.id},authConfig.secret,{
            expiresIn:10800,
        })
        if (type==='cliente')
        {
            user.payment.forEach(Item => {
                Item.cvc=""
            });
        }
        user.password=undefined;
        return res.json({user,token})
    },

    async update(req,res){
        const{email}=req.body;
        const{name}=req.body;
        const{type} = req.body;
        const {id} = req.body;
        const{password}=req.body
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
                    break;
            }
        }
        return res.json({"ok":true})
    },

}
