const uuid = require("uuid/v4");

const HttpError = require("../models/http-error");

let DummyPlaces = [
  {
    id: "p1",
    title: "Koln Cathedral",
    description: "one of the most beautiful cathedral in germany",
    location: {
      lat: 50.9412784,
      lng: 6.9582814
    },
    address: "Domkloster 4, 50667 Köln",
    creator: "u1"
  }
];

const getPlacesById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DummyPlaces.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("Could not found such place with this id", 404);
  }

  res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DummyPlaces.filter(p => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not found such places with this user id", 404)
    );
  }

  res.json({ places });
};

const createdPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DummyPlaces.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DummyPlaces.find(p => p.id === placeId) };
  const placeIndex = DummyPlaces.findIndex(p => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DummyPlaces[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  DummyPlaces = DummyPlaces.filter(p => p.id !== placeId);
  res.status(200).json({ message: "place deleted" });
};

exports.getPlacesById = getPlacesById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createdPlace = createdPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
