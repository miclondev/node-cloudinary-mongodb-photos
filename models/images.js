const mongoose = require("mongoose");
const { Schema } = mongoose; 

const imagesSchema = new Schema({
    title: String,
    shortDescription: String,
    description: String,
    link: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
})


mongoose.model("images", imagesSchema);