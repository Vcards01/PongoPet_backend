const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    address:{
        zipCode:String,
        city:String,
        neighborhood:String,
        street:String,
        number:Number,
    },
    items:[{
        item:String,
        price:Number,
        quantity:Number,
    }],
});

module.exports = mongoose.model('Cliente',UserSchema)