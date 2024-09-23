const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messDetailSchema = new Schema({
    ownerName: {
        type: String,
        required: true,
    },
    contactDetails: {
        type: String,
        required: true,
    },
    messDescription: {
        type: String,
        required: true,
    },
    termsAndConditions: {
        type: String,
        required: true,
    }
});

module.exports  = mongoose.model("MessDetail", messDetailSchema);

