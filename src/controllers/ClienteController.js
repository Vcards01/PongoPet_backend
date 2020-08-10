const Cliente = require("../models/Cliente");

module.exports={
    async updateAddress(req,res){
        const {id} = req.body;
        const address = req.body.data;
        let user= await Cliente.findOne({_id:id});
        if (!user){
            return res.json(({"error":'USUARIO NÃO EXISTE',"status":"400"}))
        }
        await Cliente.updateOne({_id:id},{$set: {address:address}});
        return res.json({"ok":true})

    },
    async updatePayments(req,res)
    {
        const {id} = req.body;
        const payments= req.body.data;
        let user= await Cliente.findOne({_id:id});
        if (!user){
            return res.json(({"error":'USUARIO NÃO EXISTE',"status":"400"}))
        }
        await Cliente.updateOne({_id:id},{$set: {payment:payments}});
        return res.json({"ok":true})
    } ,
}