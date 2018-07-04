const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingSchema = new Schema({
    homeTitle: String,
    homeSubtitle: String,
    homeImage: { type: mongoose.Schema.Types.ObjectId, ref: "photo" },
    image: {
        position: String
    }
})

mongoose.model("setting", settingSchema);