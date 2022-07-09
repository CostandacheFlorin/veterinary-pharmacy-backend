const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const orderSchema = new Schema({
    userId: {type: String, required: true},
    products: {type: Array, required: true},
    numberOfItems: {type: Number, required: true},
    total: {type:Number, required:true},
    address: {type:String, required: true},
    firstname: {type:String, required: true},
    lastname: {type:String, required: true},
    zipcode: {type:String, required: true},
    city: {type:String, required: true},
    phone: {type:Number, required: true},
    email: {type:String, required: true},
    county: {type:String, required: true},
    status: {type:String, required:true},
    date: {type: String ,required: true}
})



module.exports = mongoose.model("Order", orderSchema);