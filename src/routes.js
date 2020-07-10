const express = require("express");
const multer = require("multer")
const uploadConfig = require('./config/upload')
const ClienteController =require("./controllers/ClienteController")
const PetShopController= require("./controllers/PetShopController")
const ItemsController = require("./controllers/ItemController")

const routes = express.Router();
const upload = multer(uploadConfig);

routes.post('/',(req,res)=>{
    return res.json({message:"Ola"} )
});

//Rotas do Cliente
routes.post("/registerCliente",ClienteController.store)
routes.post("/loginCliente",ClienteController.show)

//Rotas do PetShop
routes.post("/registerPetShop",PetShopController.store)
routes.post("/loginPetShop",PetShopController.show)

//Rotas Item
routes.post("/items",upload.single("thumbnail"),ItemsController.store)
routes.post("/listCategories",ItemsController.index_categories)
routes.post("/listItems",ItemsController.index)

module.exports=routes