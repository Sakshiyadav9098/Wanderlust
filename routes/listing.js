const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
router.use(express.urlencoded({ extended: true }));

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync (listingController.createListing)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

  router
    .route("/:id")
    .get(wrapAsync (listingController.showListing))
    .put( 
       isLoggedIn,
       isOwner,
       upload.single("listing[image]"),
       validateListing, 
       wrapAsync (listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
  
  // Edit Route
  router.get(
    "/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync (listingController.renderEditForm));


    //Search Route 
    router.get("/", async (req, res) => {
      try {
          let searchQuery = req.query.search || ""; // Get search input
          let listings;
  
          if (searchQuery) {
              listings = await Listing.find({
                  title: { $regex: searchQuery, $options: "i" } // Case-insensitive search
              });
          } else {
              listings = await Listing.find({}); // Show all listings if no search input
          }
  
          res.render("listings/index", { listings, searchQuery });
      } catch (err) {
          console.log(err);
          res.redirect("/");
      }
  });
  

  module.exports = router;