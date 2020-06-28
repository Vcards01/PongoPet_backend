//index,show,update,destroy
const PetShop = require("../models/UserPetShop");
const { exists } = require("../models/UserPetShop");

module.exports={
    async store(req,res){
        var exists=true;
        const {name} = req.body;
        const {email} = req.body;
        const {password} = req.body;
        const {petshop_name}= req.body;
        const {contact}=req.body;

        let user = await PetShop.findOne({email});
        if (!user){
            user = await PetShop.create({name,email,password,petshop_name,contact})
            exists=false
        }
        return res.json({user,exists})
    },

    async show(req,res){
        var token="";
        var exists=true;
        const{email}=req.body;
        const{password}=req.body;

        let user = await PetShop.findOne({email});
        if (!user){
            exists=false;
        }
        else{
            if (user.password === password)
            {
                var token=user.id;
            }
        }
        return res.json({token,exists})
    }



}