const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true},
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  
  usage: { type: String, required: true },
  species: [{
    specie: { type: String, required: true }
  }],
  ingredients: [{
    name: { type: String, required: true },
    quantity: { type: String, required: true },
  }],
  category: {type: String, required: true}
});

module.exports = mongoose.model("Product", productSchema);
