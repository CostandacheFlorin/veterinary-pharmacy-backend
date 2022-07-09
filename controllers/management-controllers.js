const HttpError = require("../models/http-error");
const Cart = require("../models/Cart");
const Favorites = require("../models/FavoritesList");
const Review = require("../models/Review");
const addCart = async (req, res, next) => {
  const { userID, items, totalQuantity, totalPrice } = req.body;

  const createdCart = new Cart({
    userId: userID,
    products: items,
    totalQuantity,
    totalPrice,
  });

  let existentCart;

  try {
    existentCart = await Cart.updateOne(
      { userId: userID },
      { totalPrice: totalPrice, totalQuantity: totalQuantity, products: items },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ message: "Cart updated" });
};

const getCartById = async (req, res, next) => {
  
  const userID = req.params.userID;

  let cart;

  try {
    cart = await Cart.findOne({ id: userID },'-_id -__v')
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ cart });
};

const deleteCartById = async (req, res, next) => {
  
  const userID = req.params.userID;

  let cart;

  try {
    cart = await Cart.deleteOne({ id: userID });
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ message: "Cart deleted." });
};

const addFavorites = async (req, res, next) => {
  const { userId, items } = req.body;
  const createdFavoritesList = new Favorites({
    userId, 
    products: items,
   
  });

  let existentCart;

  try {
    existentFavorites = await Favorites.updateOne(
      { userId },
      { products: items },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ message: "Favorites updated" });
};

const getFavoritesById = async (req, res, next) => {
  
  const userID = req.params.favoriteID;
  console.log(userID);

  let favorites;

  try {
    favorites = await Favorites.findOne({ id: userID },'-_id -__v')
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ favorites });
};

const getNumberOfFavoritesByid = async (req, res, next) => {
  
  const userID = req.params.favoriteID;

  let favorites;

  try {
    favorites = await Favorites.findOne({ id: userID },'-_id -__v')
  } catch (err) {
    return next(err);
  }
  

  res.status(200).json({number: favorites.products.length});
};


const addReview = async (req, res, next) => {
  const { userId, text, starsNumber, productName } = req.body;

  console.log(userId + " " + text + " " + starsNumber + " " + productName);

  let data = new Date().toISOString().split('T')[0];
console.log(data);
  const createdReview = new Review({
    userId, 
    productName,
    text,
    starsNumber,
    date: data 
   
  });
  console.log(createdReview);

  try {
      await createdReview.save();
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ message: "Review added" });
};






const getReviewsByProductname = async (req, res, next) => {
  
  const productid = req.params.pid;

  let reviews;

  try {
    reviews = await Review.find({ productName: productid })
  } catch (err) {
    return next(err);
  }




  res.status(200).json({reviews :reviews});
};



exports.addCart = addCart;
exports.getCartById = getCartById;
exports.addFavorites = addFavorites;
exports.getFavoritesById = getFavoritesById;
exports.getNumberOfFavoritesByid = getNumberOfFavoritesByid;
exports.addReview = addReview;
exports.getReviewsByProductname = getReviewsByProductname;
exports.deleteCartById = deleteCartById;
