const express = require("express");
const multer = require("multer")
const uploadConfig = require('./config/upload')
const UserController =require("./controllers/UserController")
const ItemsController = require("./controllers/ItemController")
const ClienteController = require("./controllers/ClienteController")
const PedidoController = require("./controllers/PedidoController")

const routes = express.Router();
const upload = multer(uploadConfig);

//Rotas Usuario
routes.post("/register",UserController.register)
routes.post("/auth",UserController.athenticate)
routes.post("/update",UserController.update)
//Cliente
routes.post("/update_address",ClienteController.updateAddress)
routes.post("/update_payments",ClienteController.updatePayments)

//Rotas Item
routes.post("/items",upload.single("thumbnail"),ItemsController.store)
routes.post("/listCategories",ItemsController.indexCategories)
routes.post("/listItems",ItemsController.index)
routes.post("/updateItems",upload.single("thumbnail"),ItemsController.update)
routes.post("/myItems",ItemsController.get_by_petshop)

//Rotas Pedido
routes.post("/pedido",PedidoController.store)
routes.post("/myPedidos",PedidoController.show)

module.exports=routes