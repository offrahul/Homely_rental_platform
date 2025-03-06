const express = require("express");
const router = express.Router();//router object

//wrapasync
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");


//files or folder
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})

//login middleware.js
const { islogin,isowner,validateListing } = require("../middleware.js")

const listingController=require("../controllers/listings.js");


//index,post route
router
.route("/")
.get(wrapAsync(listingController.index))
.post(islogin,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing))





//new route
router.get("/new", islogin, wrapAsync(listingController.renderNewRoute));


//show and update and delete
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(islogin,isowner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(islogin,isowner, wrapAsync(listingController.destroyListing))




router.get("/:id/edit", islogin,isowner, wrapAsync(listingController.renderEditForm));



module.exports = router;