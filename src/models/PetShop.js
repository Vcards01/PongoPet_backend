const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: String,
    petshop_name:String,
    email:String,
    confirmed:false,
    password:{
        type:String,
        required:true,
        select:false,
    },
    account:{
        banco:String,
        agencia:String,
        conta:String,
    },
    contact:String,
    time:String,
    entrega:Boolean,
    earn:0,

});
UserSchema.pre('save',async function(next){
    const hash = await bcrypt.hash(this.password,10);
    this.password=hash;
    next();
});

module.exports = mongoose.model('PetShop',UserSchema)