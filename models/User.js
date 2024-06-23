// const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose')
const validator = require('validator');

const{ Schema } = mongoose;


const UserSchema = new Schema({
    name : {
        type: String,
        required: true,
        minLength:[3 , "Must contain atleast 3 Characters"]
    },
    // username:{
    //     type:String,
    //     required:true
    // },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail , "Please provide a valid Email"]
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    role:{
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
});

module.exports = mongoose.model('user', UserSchema)