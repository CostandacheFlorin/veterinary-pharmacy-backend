const express = require("express");
const validator = require("../util/Validators/validate");

const router = express.Router();

const usersControllers = require("../controllers/users-controllers");

router.post("/login", usersControllers.login);

router.post(
  "/signup",
  validator.validateUserFields,
  usersControllers.signup
);


module.exports = router;
