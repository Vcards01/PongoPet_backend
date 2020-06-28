const express = require("express");
const routes = require("./routes");
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

mongoose.connect('mongodb+srv://pongo:pongo@pongo-aiy8e.mongodb.net/<PongoDB>?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(3333);
