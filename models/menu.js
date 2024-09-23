const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const menuSchema = new Schema({
    image: {
        filename: String,
        url: String
    },
    description: { // Update this to match the form field
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports=mongoose.model("Menu",menuSchema)
