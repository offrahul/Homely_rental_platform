const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const { listingSchema,reviewSchema } = require("./schema.js");//for validation on serve side (joi)
//expresserror
const ExpressError = require("./utils/ExpressError.js");

module.exports.islogin = (req, res, next) => {
    // console.log(req.user);

    //redirect url
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you are not login!!!!");
        return res.redirect("/login");

    }
    next();
}



//save in locals if the user access the the add list we reditrct ti login than we redirect to the what user access
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}


module.exports.isowner=async(req,res,next)=>{
      // Check if the logged-in user is NOT the owner
      let {id}=req.params;
      let listing=await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You can only edit your own listings!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//server side request by hopscotch (schema.js and require )
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);//joi
    if (error) {
      let errorMsg = error.details.map((el) => el.message).join(",");//if any error arrises then it will display (serverside and client side)
      //  throw new ExpressError(404,errorMsg);
      return next(new ExpressError(404, errorMsg));
    } else {
      next();
    }
  }




  //validate review
module.exports.validateReview=(req,res,next)=>{
      let {error}= reviewSchema.validate(req.body);//joi
      if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");//if any error arrises then it will display (serverside and client side)
        return next(new ExpressError(404, errorMsg));    }else{
        next();
      }
    }




   //is review author 
module.exports.isReviewAuthor=async(req,res,next)=>{
  // Check if the logged-in user is NOT the owner
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
if (!review.author._id.equals(res.locals.currUser._id)) {
req.flash("error", "You can only edit your own Review!");
return res.redirect(`/listings/${id}`);
}
next();
}