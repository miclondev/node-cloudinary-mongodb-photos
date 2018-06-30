const mongoose = require("mongoose");
const { Schema } = mongoose;

const collectionSchema = new Schema({
    title: String,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    contentCount: { type: Number, default: 0 },
    content: {
        images: [
            { type: mongoose.Schema.Types.ObjectId, ref: "photo" }
        ]
    },
    likes: { type: Number, default: 0 },
    created_on: { type: Date, default: Date.now }
})

mongoose.model("collection", collectionSchema);