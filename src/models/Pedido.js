const mongoose = require('mongoose')

const PedidoSchema = new mongoose.Schema({
    item:{},
    cliente:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cliente"
    },
    cliente_name:String,
    endereco:{},
    pagamento:{},
    approved:Boolean,
})

module.exports = mongoose.model('Pedido',PedidoSchema)