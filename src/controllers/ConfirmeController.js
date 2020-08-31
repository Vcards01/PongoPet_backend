const jwt= require('jsonwebtoken')
const authConfig = require("../config/auth.json")
const Cliente = require("../models/Cliente");
const PetShop = require('../models/PetShop');



module.exports={
    async update(req,res){
        const token = req.body.token;
        const email = req.body.email;
        const type = req.body.type;
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
                    await Cliente.updateOne({email:email},{$set: {confirmed:true}});
                    break;
                case 'petshop':
                    await PetShop.updateOne({email:email},{$set: {confirmed:true}});
                    break;
            }
            return res.json({"ok":true})
        }

}
}