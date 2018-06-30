const mongoose = require("mongoose");
const { Schema } = mongoose;
var passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: String,
    fullname: String,
    username: String,
    about: String,
    phone: Number,
    image: String,
    country: String,
    city: String,
    canUpload: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    passport: String,
    content: {
        imageCount: { type: Number, default: 0 }
    },
    following: { 
        account: [ { type: mongoose.Schema.Types.ObjectId, ref: "users" } ],
        count: { type: Number, defult: 0 }
    },
    followers: {
        account: [ { type: mongoose.Schema.Types.ObjectId, ref: "users" } ],
        count: { type: Number, defult: 0 }
    },
    settings: {
        language: { type: String, default: 'En' },
        country: String
    },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);

mongoose.model("user", userSchema);