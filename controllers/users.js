const User=require("../models/user.js");



module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs"); 
}
module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({email,username});
     const registerUser= await User.register(newUser,password);
     console.log(registerUser);
     req.login(registerUser,(err)=>{//signup then  automatic login happens  
        if(err){
             return next(err);
            }
        req.flash("success","welcome to Homely");
     res.redirect("/listings");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to Homely!!");

    // res.redirect("/listings");
    let redirectUrl=res.locals.redirectUrl ||"/listings";//if we diect login through page
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{

        if(err){
            return next(err);

        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");

    })
}