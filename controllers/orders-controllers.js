require("dotenv").config();
const HttpError = require("../models/http-error");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const managementControllers = require("../controllers/management-controllers");

const sendOrder = async (req, res, next) => {
  const {
    userId,
    products,
    numberOfItems,
    total,
    address,
    firstname,
    lastname,
    zipcode,
    city,
    phone,
    email,
    county,
    status,
  } = req.body;

  const createdOrder = new Order({
    userId,
    products,
    numberOfItems,
    total,
    address,
    firstname,
    lastname,
    zipcode,
    city,
    phone,
    email,
    county,
    status,
    date: "23 august 1999",
  });

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: products.map((item) => {
        return {
          price_data: {
            currency: "ron",
            product_data: { name: item.name },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/trimite-comanda",
    });

    await createdOrder.save();
    console.log("aici");

    res.status(201).json({
      message: "Your order has been succesfully placed, thanks for shopping!",
      url: session.url,
    });
  } catch (err) {
    const error = new HttpError(
      "Placing the order failed, please try again later, 500"
    );
    return next(err);
  }
};

const getLatestOrderDetails = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);
  let order;
  try {
    order = await Order.find({ userId: userId });
    latestOrder = order[order.length - 1];
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ data: latestOrder });
};

const getAllOrders = async (req, res, next) => {
  let orders;
  let totalOrders;
  try {
    orders = await Order.find({});
    totalOrders = await Order.count({});
  } catch (err) {
    const error = new HttpError(
      "Fetching orders failed,please try again later.",
      500
    );
    return next(error);
  }
  let incasari = 0;
  orders.map((order) => {
    incasari += order.total;
  });

  res.json({
    orders: orders.map((order) => order.toObject({ getters: true })),
    total: totalOrders,
    revenue: incasari
  });
};

exports.sendOrder = sendOrder;
exports.getLatestOrderDetails = getLatestOrderDetails;
exports.getAllOrders = getAllOrders;
