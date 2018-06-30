const mongoose = require("mongoose");
const { Schema } = mongoose;

const collectionSchema = new Schema({
    title: String,
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    contentCount: { type: Number, default: 0 },
    content: {
        images: [
            { type: mongoose.Schema.Types.ObjectId, ref: "photo" }
        ]
    }
})

mongoose.model("collection", collectionSchema);