const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const toySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  material: [{
    name: { type: String, required: true },
  }],
});

module.exports = mongoose.model("Toy", productSchema);
