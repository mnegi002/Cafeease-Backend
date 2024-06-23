const mongoose = require('mongoose')
const {Schema} = mongoose

const CartItemSchema = new Schema({
    email :{
        type : String ,
        required : true ,
        unique : true
    },
    items :[{
        name:String,
        quantity : Number,
        price : Number,
        totalPrice : Number
    }],
    totalAmount: Number,
})

module.exports = mongoose.model('cartitems' , CartItemSchema)