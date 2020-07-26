const express = require("express");
const multer = require("multer")
const uploadConfig = require('./config/upload')
const UserController =require("./controllers/UserController")
const ItemsController = require("./controllers/ItemController")

const routes = express.Router();
const upload = multer(uploadConfig);

//Rotas Usuario
routes.post("/register",UserController.register)
routes.post("/auth",UserController.athenticate)

//Rotas Item
routes.post("/items",upload.single("thumbnail"),ItemsController.store)
routes.post("/listCategories",ItemsController.index_categories)
routes.post("/listItems",ItemsController.index)

module.exports=routes