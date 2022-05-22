const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Product = require("../models/Product");



const getAllProducts = async (req,res,next) => {
    let products;
    try {
        products = await Product.find({});
    }catch (err) {
        const error = new HttpError(
            'Fetching products failed,please try again later.', 500
        );
        return next(error);
    }
    res.json({products: products.map(product => product.toObject({getters:true}))});
}

const getProductById = async (req, res, next) => {
  const productId = req.params.productid;
  let product;

  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Could not find the product with the provided id.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided id.",
      404
    );
    returnnext(error);
  }
  res.json({ product: product.toObject({ getters: true }) });
};

const addProduct = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const {
    name,
    price,
    category,
    subcategory,
    description,
    usage,
    species,
    ingredients,
  } = req.body;

  const createdProduct = new Product({
    name,
    description,
    price,
    image:
      "https://petchemist.com.au/product_images/uploaded_images/cat-health-care-collection.jpg",
    category,
    subcategory,
    usage,
    species,
    ingredients,
  });

  try {
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating the product failed, please try again.",
      500
    );

    return next(err);
  }

  res.status(201).json({ product: createdProduct });
};

const editProductById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(" The inputs you provided are wrong.", 500);
    return next(error);
  }
  const {
    name,
    price,
    category,
    subcategory,
    description,
    usage,
    species,
    ingredients,
    image,
  } = req.body;

  const productid = req.params.productid;
  let product;

  try {
    product = await Product.findById(productid);
  } catch (err) {
    const error = new HttpError(
      " Something went wrong while trying to edit the product, product not found",
      500
    );
    return next(error);
  }

  product.name = name;
  product.category = category;
  product.subcategory = subcategory;
  product.description = description;
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
    product = await Product.findById(productid);
  } catch (err) {
    const error = new HttpError(
      "Could not find the product you want to delete.",
      500
    );
    return next(error);
  }

  try {
    await product.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while trying to delete the product.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Product deleted." });
};

exports.getProductById = getProductById;
exports.addProduct = addProduct;
exports.editProductById = editProductById;
exports.deleteProductById = deleteProductById;
exports.getAllProducts = getAllProducts;
