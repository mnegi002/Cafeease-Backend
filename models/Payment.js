const mongoose = require('mongoose')
const { Schema } = mongoose

const PaymentSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    payment_status : {
        type : String,
        default : 'pending'
    },
    sessionId : {
        type : String,
        required:true
    },
})

module.exports = mongoose.model('payments' , PaymentSchema)