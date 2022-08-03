const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");
const productsRoutes = require("./routes/products-routes");
const usersRoutes = require("./routes/users-routes");
const managementRoutes = require("./routes/management-routes");
const ordersRoutes = require("./routes/orders-routes");
const cors = require("cors");
const fs = require("fs");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/management", managementRoutes);
app.use("/api/orders", ordersRoutes);
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});



mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hfygy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
