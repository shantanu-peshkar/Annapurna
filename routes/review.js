const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const {listingSchema ,reviewSchema,menuSchema,infoSchema}=require("../schema.js");
const ErrorExpress=require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const Review = require('../models/review.js');
const { isLoggedIn ,isreviewAuthor} = require("../middleware.js");
const reviewController=require("../controllers/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ErrorExpress(400, error.details[0].message); // Use error directly
    } else {
        next();
    }
}


//reviews
router.post("/",validateReview,isLoggedIn, wrapAsync(reviewController.review));


//review delete
router.delete("/:reviewId",isLoggedIn,isreviewAuthor, wrapAsync(reviewController.deletereview))

module.exports=router;