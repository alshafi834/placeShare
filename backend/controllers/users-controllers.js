const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");
const User = require("../models/users-model");

//To get all the users ---------------------------------------------------------->
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Could not get the users", 500);
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

//To Sign up the users----------------------------------------------------------->
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("invalid input passed in req body", 422));
  }

  const { name, email, password } = req.body;

  let existUser;
  try {
    existUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Sign up failed, try again", 500);
    return next(error);
  }

  if (existUser) {
    const error = new HttpError("User exists already!", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user, Please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed, Please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      JWT_Key,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Sign up failed, Please try again", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//To Login the users ------------------------------------------------------------------->
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existUser;
  try {
    existUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed, try again", 500);
    return next(error);
  }

  if (!existUser) {
    const error = new HttpError("Invalid password or username", 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existUser.password);
  } catch (err) {
    const error = new HttpError(
      "Couldn not log you in, please check your credentials",
      500
    );
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid password or username", 403);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existUser.id, email: existUser.email },
      process.env.JWT_Key,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Login failed, Please try again", 500);
    return next(error);
  }

  res.json({
    userId: existUser.id,
    email: existUser.email,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
