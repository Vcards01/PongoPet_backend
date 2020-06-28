const express = require("express");
const ClienteController =require("./controllers/ClienteController")
const PetShopController= require("./controllers/PetShopController")
const routes = express.Router();

routes.post('/',(req,res)=>{
    return res.json({message:"Ola"} )
});

//Rotas do Cliente
routes.post("/registerCliente",ClienteController.store)
routes.post("/loginCliente",ClienteController.show)

//Rotas do PetShop
routes.post("/registerPetShop",PetShopController.store)
routes.post("/loginPetShop",PetShopController.show)


module.exports=routes