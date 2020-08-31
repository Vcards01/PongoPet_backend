const express = require("express");
const multer = require("multer")
const uploadConfig = require('./config/upload')

const VerifyUser = require("./controllers/ConfirmeController")
const UserController =require("./controllers/UserController")
const PetshopController =require("./controllers/PetshopController")
const SessionController = require("./controllers/SessionController")
const ItemsController = require("./controllers/ItemController")

const PetshopItensController = require("./controllers/PetshopItensController")

const CustomerController = require("./controllers/CustomerController")
const PedidoController = require("./controllers/OrderController")
const CustumerOrderController = require("./controllers/CustomerOrderController")
const PetshopOrderController = require("./controllers/PetshopOrderController")

const routes = express.Router();
const upload = multer(uploadConfig);

//Rotas Usuario Geral
routes.post("/user/register",UserController.store)
routes.post("/user/update",UserController.update)
routes.post("/user/login",SessionController.index)
routes.post("/itens/list_categories",ItemsController.index_categories)
routes.post("/user/confirm",VerifyUser.update)
routes.post("/user/update_pass",SessionController.request_update)
routes.post("/user/update_pass/update",SessionController.update)

//Cliente
routes.post("/customer/update_address",CustomerController.update_address)
routes.post("/customer/update_payments",CustomerController.update_payments)
routes.post("/customer/order/open",CustumerOrderController.showOpen)
routes.post("/customer/order/closed",CustumerOrderController.showClosed)
routes.post("/customer/pedido",PedidoController.store)

//Rotas Petshop
routes.post("/petshop/new_item",upload.single("thumbnail"),ItemsController.store)
routes.post("/petshop/list_itens",PetshopItensController.index)
routes.post("/petshop/list_items",ItemsController.index)
routes.post("/petshop/update_items",upload.single("thumbnail"),ItemsController.update)
routes.post("/petshop/delete_item",ItemsController.destroy)
routes.post("/petshop/new_orders",PetshopOrderController.show_new)
routes.post("/petshop/opened_orders",PetshopOrderController.show_opened)
routes.post("/petshop/closed_orders",PetshopOrderController.show_closed)
routes.post("/petshop/ok_orders",PetshopOrderController.show_ok)
routes.post("/petshop/account/update",PetshopController.update_account)
routes.post("/petshop/earn",PetshopController.index_earn)
//Rotas Pedido


routes.post("/pedido/update",PedidoController.update)

module.exports=routes