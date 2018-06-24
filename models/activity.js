const mongoose = require("mongoose");
const { Schema } = mongoose;

const activitySchema = new Schema({
    upload: {
        images: [String],
    },
    comment: {
        user: String,
        comment: String
    },
    created_at: { type: Date, default: Date.now }
})

mongoose.model("activity", activitySchema);