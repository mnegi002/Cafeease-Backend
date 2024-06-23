const express = require('express')
const mongoose = require('mongoose');


const mongoURI =  'mongodb+srv://mayank:mayank2002@food-order.zuokjbh.mongodb.net/foodordering?retryWrites=true&w=majority'
const cartDB = async () => {
    await mongoose.connect(mongoURI , { useNewUrlParser : true } , async(err,result) =>{
        if(err){
            console.log("---",err)
        }
        else{
            console.log("connected in cartDB")
            const fetched_data = await mongoose.connection.db.collection("cartitems")
            fetched_data.find({}).toArray(function(err , data){
                if(err) console.log(err);
                // else console.log(data)
                
            })
        }
    })
}



module.exports = cartDB