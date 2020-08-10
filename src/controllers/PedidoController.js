const Pedido = require ("../models/Pedido");
const Item = require("../models/Item");
const Cliente = require("../models/Cliente")

module.exports={
    async store(req,res){
        console.log()
        const{user}=req.body;
        const {endereco}=req.body;
        const {pagamento}=req.body;
        const items=req.body.items;
        const cliente_name=req.body.cliente_name
        items.forEach(async(Item)=> {
            await Pedido.create({item:Item,cliente:user,endereco:endereco,pagamento:pagamento,cliente_name:cliente_name})
        });
        return res.json({"status":"OK"})
    },

    async show(req,res)
    {
        const id=req.body.id
        var pedido=await Pedido.find({"item.petshop":id});
        return res.json({pedido})
    }

}