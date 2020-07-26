const express = require("express");
const routes = require("./routes");
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path')

const app = express();

mongoose.connect('mongodb+srv://pongo:pongo@pongo-aiy8e.mongodb.net/<PongoDB>?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

app.use(cors())
app.use(express.json())
app.use('/files',express.static(path.resolve(__dirname,"..","uploads")));
app.use(routes)
require("./controllers/ProjectController")(app);

app.listen(3333);
