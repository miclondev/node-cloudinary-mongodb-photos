const mongoose = require("mongoose")
const { Schema } = mongoose;
const { createSlugWithDate } = require('../funcs/friendlyUrl')

const photosSchema = new Schema({
    title: String,
    slug: { type: String, unique: true },
    shortDesc: String,
    description: String,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    created_on: { type: Date, default: Date.now }
})

photosSchema.pre('save', function (next) {
    this.slug = createSlugWithDate(this.title)
    next()
})

mongoose.model("photos", photosSchema);