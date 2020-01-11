const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload");

const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:pid", placesControllers.getPlacesById);
router.get("/user/:uid", placesControllers.getPlaceByUserId);
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  placesControllers.createdPlace
);
router.patch(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  placesControllers.updatePlaceById
);
router.delete("/:pid", placesControllers.deletePlaceById);

module.exports = router;
