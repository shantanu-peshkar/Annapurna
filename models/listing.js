const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");
const Menu=require("./menu.js");
const MessDetail = require("./detail.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true
    },
    image: {
        url: String,
        filename: String,
       
    },
    price: Number,
    location: String,
    City: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    menus:[
        {
            type:Schema.Types.ObjectId,
            ref:"Menu"
        }
    ],
    messDetail: {
        type: Schema.Types.ObjectId,
         ref: "MessDetail"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
   
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        await Menu.deleteMany({ _id: { $in: listing.menus } });
        // Remove associated messDetail when listing is deleted
        if (listing.messDetail) {
            await MessDetail.findByIdAndDelete(listing.messDetail);
        }
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;




