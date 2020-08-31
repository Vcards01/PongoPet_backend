const mongoose = require('mongoose')


const ItemSchema = new mongoose.Schema({
    name:String,
    quantity:Number,
    petshop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PetShop"
    },
    petshop_name:String,
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

    return `${process.env.BACKEND_URL}/files/${this.thumbnail}`
})

module.exports = mongoose.model('Item',ItemSchema)