const HttpError = require("../models/http-error");

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

  const createdUser = new User({
    name,
    email,
    image:
      "https://pbs.twimg.com/profile_images/1055263632861343745/vIqzOHXj.jpg",
    password,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed, Please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
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

  if (!existUser || existUser.password !== password) {
    const error = new HttpError("Invalid password or username", 401);
    return next(error);
  }

  res.json({
    message: "logged in",
    user: existUser.toObject({ getters: true })
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
