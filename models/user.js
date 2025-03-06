const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    //username and password can declared by passport-localmongoose automatically defines
    email: {
        type: String,
        required: true
    }

});
userSchema.plugin(passportLocalMongoose);//craeted automatic username,hashing,salting,hashpassword

module.exports = mongoose.model("User", userSchema);

