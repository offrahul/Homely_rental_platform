const express=require("express");
const router=express.Router({mergeParams:true});//router object(:id)
// const {reviewSchema}=require("../schema.js");//for validation on serve side (joi)
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

//expresserror
const ExpressError=require("../utils/ExpressError.js");
//wrapasync
const wrapAsync=require("../utils/wrapAsync.js");
//validate review
const {validateReview}=require("../middleware.js")
const { islogin,isowner,validateListing,isReviewAuthor } = require("../middleware.js")

const ReviewController=require("../controllers/reviews.js")

  
//reviews post route with listing 1 to many
router.post("/",islogin,validateReview,wrapAsync(ReviewController.createReview))
  
  //delete review route
  router.delete("/:reviewId",islogin,isReviewAuthor,wrapAsync(ReviewController.destroyReview))

  module.exports=router;