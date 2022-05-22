const express = require("express");
const { check } = require("express-validator");
const validator = require("../util/Validators/validate");
const checkAuth = require('../middleware/check-auth');

const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET Request in products");
  res.json({ message: "It works" });
});

router.get("/get-product-by-id/:productid", productsControllers.getProductById);
router.get("/get-all-products", productsControllers.getAllProducts);



router.use(checkAuth);

router.post(
  "/add-product",
  validator.validateProductFields,
  productsControllers.addProduct
);
router.patch(
  "/edit-product/:productid",
  validator.validateProductFields,
  productsControllers.editProductById
);

router.delete(
  "/delete-product/:productid",
  productsControllers.deleteProductById
);
module.exports = router;
