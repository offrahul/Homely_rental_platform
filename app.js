//file
if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express=require("express");
const app=express();//npm i express
const mongoose = require("mongoose");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");

//express session(cookies)
const session=require("express-session");
const MongoStore = require('connect-mongo');

//flash
const flash = require("connect-flash");

//expresserror
const ExpressError=require("./utils/ExpressError.js");

//passport
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");







const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");

//ejs setup
const path=require("path");
app.set("view engine","ejs");//npm i ejs
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));//npm i method-override
app.engine("ejs",ejsMate);//it is use as includes//npm i ejs-mate





//static files
app.use(express.static(path.join(__dirname,"/public")));
//database connection

const dburl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connection to db")
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(dburl,{
    serverSelectionTimeoutMS: 30000, // Increase timeout (30 seconds)
  })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

 
}




//connect-mongo
const store=MongoStore.create({
  mongoUrl:dburl,
crypto:{
  secret:process.env.SECRET,
},
touchAfter:24*3600//refresh
});


store.on("error",()=>{
  console.log("Error in mongo session",err);

})

//session
const sessionOption={
  store,//store
  secret:process.env.SECRET,
   resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
   

  }
};




//track the client intrest
app.use(session(sessionOption));
//flash
app.use(flash());

//just after session
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//user related user store
passport.deserializeUser(User.deserializeUser());//This retrieves the user’s full data from the database using the stored _id.Fetches full user details from DB using the stored ID.


//success save cookiesflash
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;//use in ejs due to locals (uuse to parse use data)
  // console.log(res.locals.success);
  next();
})


app.use("/listings",listingsRouter);//routes
app.use("/listings/:id/reviews",reviewsRouter); 
 app.use("/",usersRouter);


app.all("*",(req,res,next)=>{
   return next(new ExpressError(404,"page not found!!!"));
})

//error handler middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
 
})

// app.listen(8080,()=>{
//     console.log("server is running on port 8080");
// })
const PORT = process.env.PORT || 8080; // Use Railway's assigned port
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
