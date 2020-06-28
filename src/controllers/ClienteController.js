//index,show,update,destroy
const Cliente = require("../models/UserCliente")

module.exports={
    async store(req,res){
        var exists=true;
        const {name} = req.body;
        const {email} = req.body;
        const {password} = req.body;

        let user = await Cliente.findOne({email});
        if (!user){
            user = await Cliente.create({name,email,password})
            exists=false
        }
        return res.json({user,exists})
    },

    async show(req,res){
        var token="";
        var exists=true;
        const{email}=req.body;
        const{password}=req.body;

        let user = await Cliente.findOne({email});
        if (!user){
            exists=false;
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