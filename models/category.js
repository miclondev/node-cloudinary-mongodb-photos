const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    name:{type: String, unique: true},
    description: String,
    icon: {type: String, default: "settings"},
    subCategories: [{
        id: { type: String, default: mongoose.Types.ObjectId() },
        name: {type: String},
        description: {type: String},
        icon: {type: String, default: "settings"}
    }],
    courseCount: {type: Number, default: 0}
})

mongoose.model("category", categorySchema);