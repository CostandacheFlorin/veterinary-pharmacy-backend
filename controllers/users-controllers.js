const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const User = require("../models/User");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Couldnt log you in, please check your credentials and try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Nume sau parola gresita.", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, username: existingUser.username },
      process.env.JWT_KEY,
      { expiresIn: "3h" }
    );
  } catch (err) {
    const error = new HttpError(
      " Logging you in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    username: existingUser.username,
    token: token,
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { username, password, email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, username: createdUser.username },
      process.env.JWT_KEY,
      { expiresIn: "3h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.....",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    username: createdUser.username,
    token: token,
  });
};

const getUsernameById = async (req, res, next) => {
  const userID = req.params.userid;

  let user;

  try {
    user = await User.findById(userID, "-_id -__v");
    console.log(user);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ username: user.username });
};

const getUsernameByIdUtil = async (userId) => {
  const userID = userId;

  let user;

  try {
    user = await User.findById(userID, "-_id -__v");
    console.log(user);
  } catch (err) {
    console.log(err);
  }

  return { username: user.username };
};

const getAllUsers = async (req, res, next) => {
  let users;
  let totalUsers;
  try {
    users = await User.find({});
    totalUsers = await User.count({});
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed,please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
    total: totalUsers,
  });
};

exports.login = login;
exports.signup = signup;
exports.getUsernameByid = getUsernameById;
exports.getUsernameByIdUtil = getUsernameByIdUtil;
exports.getAllUsers = getAllUsers;
