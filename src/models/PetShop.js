const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    petshop_name:String,
    email:String,
    password:{
        type:String,
        required:true,
        select:false,
    },
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
UserSchema.pre('save',async function(next){
    const hash = await bcrypt.hash(this.password,10);
    this.password=hash;
    next();
});

module.exports = mongoose.model('PetShop',UserSchema)