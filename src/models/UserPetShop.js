const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    petshop_name:String,
    email:String,
    password:String,
    address:
        {
        zipCode:String,
        city:String,
        neighborhood:String,
        street:String,
        number:Number,},
    contact:[String],
    time:String,
    entrega:Boolean,

});

module.exports = mongoose.model('PetShop',UserSchema)