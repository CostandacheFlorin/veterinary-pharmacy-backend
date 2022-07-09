const express = require("express");
const { check } = require("express-validator");
const validator = require("../util/Validators/validate");
const router = express.Router();
const ordersControllers = require("../controllers/orders-controllers");

router.post("/send-order", ordersControllers.sendOrder);
router.get("/get-order-by-user/:uid", ordersControllers.getLatestOrderDetails);
router.get("/get-all-orders", ordersControllers.getAllOrders);

module.exports = router;
