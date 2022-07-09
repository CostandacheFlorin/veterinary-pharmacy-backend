const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    userId: {type: String, required: true},
    productName: {type:String, required: true},
    text: {type: String, required: true},
    starsNumber: {type: Number, required: true},
    date: {type: String, required:true}
})



module.exports = mongoose.model("Review", reviewSchema);