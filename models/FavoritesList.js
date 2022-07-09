const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const favoritesSchema = new Schema({
    userId: {type: String, required: true},
    products: {type: Array, required: true},
    
})



module.exports = mongoose.model("FavoritesList", favoritesSchema);