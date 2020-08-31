const Petshop= require("../models/PetShop");
const { json } = require("express");

module.exports={

    async update_account(req,res){
        const banco = req.body.banco
        const agencia = req.body.agencia
        const conta = req.body.conta
        const id = req.body.id

        await Petshop.updateOne({_id:id},{$set: {account:{banco:banco,agencia:agencia,conta:conta}}});

        return res.json({"ok":true})
    },
    async index_earn(req,res){
        const id = req.body.id
        const valor=await Petshop.find({_id:id}).select("earn")
        var val =valor[0].earn
        return res.json({"valor":val})
    }

}