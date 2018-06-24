const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingSchema = new Schema({
    home: {
        image: String,
        title: String,
        subtitle: String,
        featured: {
            images: [String],
            collections: [
                {
                    image: String,
                    link: String,
                    title: String,
                    subtitle: String
                }
            ]
    },

    }
})

mongoose.model("setting", settingSchema);