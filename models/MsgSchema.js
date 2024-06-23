 const validator = require('validator');
 const mongoose = require('mongoose')
const {Schema} = mongoose


const MsgSchema = new Schema({
    name : {
        type: String,
        required: true,
        minLength:[3 , "Must contain atleast 3 Characters"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail , "Please provide a valid Email"]
    },
    subject:{
        type:String,
        required:true,
        minLength:[3 , "Must contain atleast 3 Characters"]
    },
    comment:{
        type:String,
        // required:true,
    
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('message', MsgSchema)