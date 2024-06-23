const mongoose = require("mongoose")
const {Schema} = mongoose

const OrderSchema = new Schema({
    email :{
        type : String ,
        required : true ,
        unique : true
    },
          items: [
            {
              // Define the structure of each item in the order
              // Adjust these fields based on your item structure
              name: String,
              quantity: Number,
              price: Number,
              // Add any other necessary fields for your items
            },
          ],
          totalAmount: Number,
          orderDate: String,
    // totalAmount : Number,
})

module.exports = mongoose.model('orders', OrderSchema)