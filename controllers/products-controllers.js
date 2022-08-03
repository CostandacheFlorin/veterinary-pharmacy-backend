const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Product = require("../models/Product");
const fs = require("fs");

const getAllProducts = async (req, res, next) => {
  let products;
  let totalProducts;
  try {
    products = await Product.find({});
    totalProducts = await Product.count({});
  } catch (err) {
    const error = new HttpError(
      "Fetching products failed,please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
    total: totalProducts,
  });
};

const getAllProductsNames = async (req, res, next) => {
  let products;
  let totalProducts;
  try {
    products = await Product.find({}).select("name");
    totalProducts = await Product.count({});
  } catch (err) {
    const error = new HttpError(
      "Fetching products failed,please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
    total: totalProducts,
  });
};

const getProductByName = async (req, res, next) => {
  const productName = req.params.productname;
  let product;

  try {
    product = await Product.findOne({ name: productName });
  } catch (err) {
    const error = new HttpError(
      "Could not find the product with the provided name.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided name.",
      404
    );
    return next(error);
  }
  res.json({ product: product.toObject({ getters: true }) });
};


const getProductImageByName = async (req,res,next) => {

  const productName = req.params.productname;
  let product;

  try {
    product = await Product.findOne({ name: productName });
  } catch (err) {
    const error = new HttpError(
      "Could not find the product with the provided name.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided name.",
      404
    );
    return next(error);
  }
  res.json({ image: product.image });



}

const addProduct = async (req, res, next) => {
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "Invalid inputs passed, please check your data",
      422
    );
    return next(error);
  }
  const { name, price, description, usage, species, ingredients } = req.body;

  

  const createdProduct = new Product({
    name,
    description,
    price,
    image: req.file.path,
    usage,
    species: JSON.parse(species),
    ingredients: JSON.parse(ingredients),
    category: "med",
  });

  try {
    await createdProduct.save();
  } catch (err) {
    if (err.code === 11000) {
      const error = new HttpError("The product name is already used", 500);
      return next(error);
    }

    const error = new HttpError(
      "Creating the product failed, please try again.",
      500
    );

    return next(err);
  }

  res.status(201).json({ product: createdProduct });
};

const editProduct = async (req, res, next) => {
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(" The inputs you provided are wrong.", 500);
    return next(error);
  }
  const {
    name,
    price,
    // category,
    // subcategory,
    description,
    usage,
    species,
    ingredients,
    image,
  } = req.body;

  const productid = req.params.productid;
  let product;

  try {
    product = await Product.findOne({_id: productid});
  } catch (err) {
    const error = new HttpError(
      " Something went wrong while trying to edit the product, product not found",
      500
    );
    return next(error);
  }



  product.name = name;
  product.description = description;
  product.usage = usage;

  product.species = species;
  product.ingredients = ingredients;

  product.price = price;
  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while trying to save the edited product",
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProductById = async (req, res, next) => {
  const productid = req.params.productid;

  let product;
  
  try {
    product = await Product.find(productid);
    
  } catch (err) {
    const error = new HttpError(
      "Could not find the product you want to delete.",
      500
    );
    return next(error);
  }

  console.log("ba");
  console.log(product);
  const imagePath = product.image;
  console.log(imagePath);


  try {
    await product.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while trying to delete the product.",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);

  })

  res.status(200).json({ message: "Product deleted." });
};

const deleteProductByName = async (req, res, next) => {
  const productname = req.params.productname;

  let product;

  try {
    foundProduct = await Product.find({name: productname});
    product = await Product.find({ name: productname }).deleteOne().exec();
  } catch (err) {
    const error = new HttpError(
      "Could not find the product you want to delete.",
      500
    );
    return next(error);
  }


  const imagePath = foundProduct[0].image;
  console.log(imagePath);

  fs.unlink(imagePath, err => {
    console.log(err);

  })


  res.status(200).json({ message: "Product deleted." });
};

exports.getProductByName = getProductByName;
exports.addProduct = addProduct;
exports.getProductImageByName = getProductImageByName;
exports.editProduct = editProduct;
exports.deleteProductById = deleteProductById;
exports.getAllProducts = getAllProducts;
exports.getAllProductsNames = getAllProductsNames;
exports.deleteProductByName = deleteProductByName;
