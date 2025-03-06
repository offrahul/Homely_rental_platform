const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
// const User=require("../models/user");


module.exports.createReview=async(req,res)=>{
    // let {id}=req.params;
    // let {rating,comment}=req.body;
    // let newReview=new Review({rating,comment,listings:id});
    // await newReview.save();
    // res.redirect(`/listings/${id}`);
  
  
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);//pass review filled come to backend
  newReview.author=req.user._id;
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();//if we change existing document then we save
    console.log("new review save");
    req.flash("success","New Review created!!!!")
 
    res.redirect(`/listings/${listing._id}`);
  
  }


  module.exports.destroyReview=async(req,res)=>{
    let{id,reviewId}=req.params;
  
  await  Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});//remove if match reviews
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Deleted Review")

    res.redirect(`/listings/${id}`)
  }