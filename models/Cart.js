const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const cartSchema = new Schema({
    userId: {type: String, required: true},
    products: {type: Array, required: true},
    totalQuantity: {type: Number, required: true},
    totalPrice: {type:Number, required:true}
})



module.exports = mongoose.model("Cart", cartSchema);