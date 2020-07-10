const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    name:String,
    quantity:Number,
    petshop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserPetShop"
    },
    category:String,
    price:Number,
    thumbnail:String,
    description:String,
},{
    toJSON:{
        virtuals:true,
    }
})
ItemSchema.virtual("thumbnail_url").get(function(){
    return `http://192.168.0.113:3333/files/${this.thumbnail}`
})

module.exports = mongoose.model('Item',ItemSchema)