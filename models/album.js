const mongoose = require("mongoose");
const { Schema } = mongoose;

const albumSchema = new Schema({
    title: String,
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    contentCount: { type: Number, default: 0 },
    content: {
        images: [
            { type: mongoose.Schema.Types.ObjectId, ref: "images" }
        ]
    }
})

mongoose.model("album", albumSchema);