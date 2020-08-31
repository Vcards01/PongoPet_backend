const Pedido = require ("../models/Pedido");

module.exports={

    async showOpen(req,res)
    {
        pedidos=[]
        const id=req.body.id
        var pedido=await Pedido.find({"cliente":id});
        pedido.forEach(element => {
            if(element.approved==="Espera"|| element.approved==="Aceito")
            {
                pedidos.push(element)
            }
        });
        return res.json({pedidos})
    },
    async showClosed(req,res)
    {
        pedidos=[]
        const id=req.body.id
        var pedido=await Pedido.find({"cliente":id});
        pedido.forEach(element => {
            if(element.approved==="Finalizado" || element.approved==="Recusado")
            {
                pedidos.push(element)
            }
        });
        return res.json({pedidos})
    },
}