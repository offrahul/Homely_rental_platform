const express=require("express");
 const router=express.Router({mergeParams:true});//router object(:id)

const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// const LocalStrategy=require("passport-local");

const userController = require("../controllers/users");




router
.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup))


router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),userController.login)


// router.get("/signup",userController.renderSignUpForm);

// router.post("/signup",wrapAsync(userController.signup));

// //login
// router.get("/login",userController.renderLoginForm)

// //signup
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",
//     {failureRedirect:"/login",failureFlash:true}),userController.login)


router.get("/logout",userController.logout)

module.exports=router;