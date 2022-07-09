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
router.get("/get-username-by-id/:userid", usersControllers.getUsernameByid);
router.get("/get-all-users", usersControllers.getAllUsers);

module.exports = router;
