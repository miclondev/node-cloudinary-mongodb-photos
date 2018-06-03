const mongoose = require("mongoose")
const { Schema } = mongoose
const { createSlug } = require('../funcs/friendlyUrl')

const categorySchema = new Schema({
    name:{type: String, unique: true },
    slug: {type:String, unique:true },
    description: String,
    icon: String,
    image: String,
    subCategories: [{
        id: { type: String, default: mongoose.Types.ObjectId() },
        name: {type: String},
        description: {type: String},
        icon: {type: String, default: "settings"}
    }],
    itemCount: {type: Number, default: 0}
})

categorySchema.pre('save', function(next){
    this.slug = createSlug(this.name)
    next()
})

mongoose.model("category", categorySchema);