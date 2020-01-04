const express = require("express");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesControllers.getPlacesById);
router.get("/user/:uid", placesControllers.getPlaceByUserId);
router.post("/", placesControllers.createdPlace);
router.patch("/:pid", placesControllers.updatePlaceById);
router.delete("/:pid", placesControllers.deletePlaceById);

module.exports = router;
