const Pedido = require ("../models/Pedido");

module.exports={

    async show_new(req,res)
    {
        const id=req.body.id
        pedidos=[]
        var pedido=await Pedido.find({"item.petshop":id});
        pedido.forEach(element => {
            if(element.approved==="Espera")
            {
                pedidos.push(element)
            }
        });
        
        return res.json({pedidos})
    },

    async show_opened(req,res)
    {
        pedidos=[]
        const id=req.body.id
        var pedido=await Pedido.find({"item.petshop":id});
        pedido.forEach(element => {
            if(element.approved==="Aceito")
            {
                pedidos.push(element)
            }
        });
        return res.json({pedidos})
    },

    async show_closed(req,res)
    {
        pedidos=[]
        const id=req.body.id
        var pedido=await Pedido.find({"item.petshop":id});
        pedido.forEach(element => {
            if(element.approved==="Finalizado" || element.approved==="Recusado")
            {
                pedidos.push(element)
            }
        });
        return res.json({pedidos})
    },

    async show_ok(req,res){
        pedidos=[]
        const id=req.body.id
        var pedido=await Pedido.find({"item.petshop":id});
        pedido.forEach(element => {
            if(element.approved==="Finalizado")
            {
                pedidos.push(element)
            }
        });
        return res.json({pedidos})

    }



}