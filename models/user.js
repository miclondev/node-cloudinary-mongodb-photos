const mongoose = require("mongoose");
const { Schema } = mongoose;
var passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: String,
    fullname: String,
    username: String,
    phone: Number,
    image: String,
    country: String,
    city: String,
    canUpload: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    passport: String,
    content: {
        images: [
            { type: mongoose.Schema.Types.ObjectId, ref: "images" }
        ]
    },
    follow: [
        { type: mongoose.Schema.Types.ObjectId, ref: "users" }
    ],
    settings: {
        language: { type: String, default: 'En' }
    },
    isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(passportLocalMongoose);

mongoose.model("user", userSchema);