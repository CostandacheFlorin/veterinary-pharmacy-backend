const { check } = require("express-validator");

exports.validateProductFields = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("The name must have at least 5 characters."),
  check("price").not().isEmpty().withMessage("Your price field is empty"),
  check("price")
    .isFloat({ min: 0.01 })
    .withMessage("You cannot set the price as 0."),
  check("description")
    .isLength({ min: 10 })
    .withMessage("The description must have at least 10 characters."),
  check("usage").not().isEmpty().withMessage("Your usage field is empty"),
  check("species").not().isEmpty().withMessage("Your species field is empty"),
  check("ingredients")
    .not()
    .isEmpty()
    .withMessage("Your ingredients field is empty"),
];

exports.validateUserFields = [
  check("username").not().isEmpty(),
  check("password").isLength({ min: 6 }),
  check("email").isEmail().withMessage("The email is not valid"),
];
