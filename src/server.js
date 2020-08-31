const express = require("express");
const routes = require("./routes");
const mongoose = require('mongoose');
const cors = require('cors')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')
const app = express();
const server=http.Server(app)
const io = socketio(server)
require('dotenv').config()

const connectedUsers={};
io.on("connection",socket => {
    const {userId} = socket.handshake.query;
    connectedUsers[userId] = socket.id
})

app.use((req,res,next)=>{
    req.io = io;
    req.connectedUsers=connectedUsers

    return next()
})


mongoose.connect('mongodb+srv://pongo:pongo@pongo-aiy8e.mongodb.net/<PongoDB>?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

app.use(cors())
app.use(express.json())
app.use('/files',express.static(path.resolve(__dirname,"..","uploads")));
app.use(routes)
require("./controllers/ProjectController")(app);

server.listen(3333);
