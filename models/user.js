const mongoose = require("mongoose");
const { Schema } = mongoose;
var passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: String,
    fullname: String,
    username: String,
    about: String,
    phone: Number,
    image: {
        name: String,
        url: String,
        secure_url: String,
        public_id: String
    },
    social: {
        instagram: String,
        facebook: String,
        website: String,
        youtube: String
    },
    gallery:{
        display: String,
        title: String
    },
    country: String,
    city: String,
    canUpload: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    passport: String,
    content: { imageCount: { type: Number, default: 0 } },
    following: {
        account: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    },
    followers: {
        account: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    },
    like: {
        photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "photo" }],
    },
    cart: {
        photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "photo" }],
    },
    settings: {
        language: { type: String, default: 'En' },
        country: String
    },
    isAdmin: { type: Boolean, default: false },
    joined_on: { type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);

mongoose.model("user", userSchema);