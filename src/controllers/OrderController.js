const Pedido = require ("../models/Pedido");
const Cliente = require("../models/Cliente");
const Petshop = require("../models/PetShop")
const nodemailer = require("nodemailer")
const SMTP_CONFIG = require('../config/mail.json')
const transporter = nodemailer.createTransport({
    host:SMTP_CONFIG.host,
    port:SMTP_CONFIG.port,
    secure:false,
    auth:{
        user:SMTP_CONFIG.user,
        pass:SMTP_CONFIG.pass,
    },
    tls:{
        rejectUnathorized:false,
    }
})

module.exports={
    async store(req,res){
        const{user}=req.body;
        const {endereco}=req.body;
        const {pagamento}=req.body;
        const items=req.body.items;
        const cliente_name=req.body.cliente_name
        items.forEach(async(Item)=> {
            const pedido= await Pedido.create({item:Item,cliente:user,endereco:endereco,pagamento:pagamento,cliente_name:cliente_name,approved:"Espera"})
            const petshop=await Petshop.findOne({_id:Item.petshop});
            await transporter.sendMail({
                html:`
                <htm>
                    <body>
                        <h3>Olá ${petshop.petshop_name},</h3><br/>
                        <p>Você recebeu um novo pedido,veja no site!</p><br/>
                    </body>
                </html>
                `,
                subject:"Novo Pedido",
                from: "Suporte PongoPet <suportepongopet@gmail.com>",
                to: petshop.email
            })
            const ownerSocket = req.connectedUsers[Item.petshop]
            if(ownerSocket){
                req.io.to(ownerSocket).emit("order_request",pedido)
            }
        });

        

        return res.json({"status":"OK"})
    },

    async update(req,res)
    {
        const id = req.body.id
        const state = req.body.state
        const cliente = req.body.cliente
        const price = req.body.price
        const petId = req.body.petId
        const pedido = await Pedido.updateOne({_id:id},{$set: {'approved':state}});
        user= await Cliente.findOne({_id:cliente});
        if(state==="Finalizado")
        {
            const valor=await Petshop.find({_id:petId}).select("earn")
            var val =valor[0].earn
            if(isNaN(val))
            {
                await Petshop.updateOne({_id:petId},{$set: {'earn':price}});
            }
            else{
                await Petshop.updateOne({_id:petId},{$set: {'earn':parseFloat(price)+parseFloat(val)}});
            }
            
        }
        await transporter.sendMail({
            html:`
            <htm>
                <body>
                    <h3>Olá ${user.name},</h3><br/>
                    <p>O status do seu pedido foi atualizado,veja no site!</p><br/>
                </body>
            </html>
            `,
            subject:"Pedido atualizado",
            from: "Suporte PongoPet <suportepongopet@gmail.com>",
            to: user.email
        })
        const ownerSocket = req.connectedUsers[cliente]
        if(ownerSocket){
            req.io.to(ownerSocket).emit("order_update",pedido)
        }
        return res.json({"ok":"ok"})

    }


}