const fs = require("fs");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../util/location");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const Place = require("../models/places-model");
const User = require("../models/users-model");

//Find place with place ID---------------------------------------------------------->
const getPlacesById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Colud not find place with this id", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not found such place with this id", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

//Get Places with User Id ---------------------------------------------------------->
const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // 1st approach
  /* let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("could not find places with this userId", 500);
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not found such places with this user id", 404)
    );
  } */

  //2nd approach
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Could not find this place with this userId",
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    const error = new HttpError("No place found with this userId", 404);
    return next(error);
  }

  //res.json({ places: places.map(place => place.toObject({ getters: true })) });
  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    )
  });
};

//To create a place ---------------------------------------------------------------->
const createdPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("invalid input passed in req body", 422);
  }

  const { title, description, address, creator } = req.body;
  let coordinates = getCoordsForAddress(address);
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find userId to create place", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

//To update a place
const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("invalid input passed in req body", 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "could not find this place with this placeId to update",
      500
    );
    return next(error);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    const error = new HttpError(
      "could not save the updated place, try again letter",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

//To delete a place
const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let placeToDelete;
  try {
    placeToDelete = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Could not find the place with this id to delete",
      500
    );
    return next(error);
  }

  if (!placeToDelete) {
    const error = new HttpError("Could not find this place for this id", 404);
    return next(error);
  }

  const imagePath = placeToDelete.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await placeToDelete.remove({ session: sess });
    placeToDelete.creator.places.pull(placeToDelete);
    await placeToDelete.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Could not delete the place with this userId",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: "place deleted" });
};

exports.getPlacesById = getPlacesById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createdPlace = createdPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
