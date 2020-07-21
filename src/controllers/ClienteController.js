//index,show,update,destroy
const Cliente = require("../models/UserCliente");
const bcrypt = require('bcryptjs');

module.exports={
    async store(req,res){
        const {name} = req.body;
        const {email} = req.body;
        const {password} = req.body;

        let user = await Cliente.findOne({email});
        if (!user){
            user = await Cliente.create({name,email,password})
        }
        else{
            return res.status(400).send({error:'usuario ja cadastrado'})
        }
        return res.json({user})
    },

    async show(req,res){
        var token="";
        var exists=true;
        const{email,password}=req.body;

        let user = await Cliente.findOne({email});
        if (!user){
            exists=false;
        }
        if(!await bcrypt.compare(password,user.password))
        {

        }
        else{
            if (user.password === password)
            {
                token=user.id;
                
            }
        }
        return res.json({token,exists})
    },



}