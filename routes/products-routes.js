const express = require("express");
const { check } = require("express-validator");
const validator = require("../util/Validators/validate");
const checkAuth = require("../middleware/check-auth");

const productsControllers = require("../controllers/products-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET Request in products");
  res.json({ message: "It works" });
});

router.get(
  "/get-product-by-name/:productname",
  productsControllers.getProductByName
);
router.get("/get-all-products", productsControllers.getAllProducts);

router.get("/get-all-products-names", productsControllers.getAllProductsNames);
router.get(
  "/get-product-image-by-name/:productname",
  productsControllers.getProductImageByName
);
router.use(checkAuth);

router.post(
  "/add-product",
  fileUpload.single("image"),
  validator.validateProductFields,
  productsControllers.addProduct
);


router.patch(
  "/edit-product/:productid",
  validator.validateProductFields,
  productsControllers.editProduct
);

router.delete(
  "/delete-product-by-id/:productid",
  productsControllers.deleteProductById
);

router.delete(
  "/delete-product/:productname",
  productsControllers.deleteProductByName
)
module.exports = router;
