const express = require("express");

const managementControllers = require("../controllers/management-controllers");
const router = express.Router();

router.post("/add-cart", managementControllers.addCart);
router.get("/get-cart/:cartID", managementControllers.getCartById);
router.post("/add-favorites", managementControllers.addFavorites);
router.get(
  "/get-favorites/:favoriteID",
  managementControllers.getFavoritesById
);
router.get(
  "/get-favorites-number/:favoriteID",
  managementControllers.getNumberOfFavoritesByid
);
router.post("/add-review", managementControllers.addReview);
router.get("/get-reviews-by-productname/:pid", managementControllers.getReviewsByProductname);
module.exports = router;
