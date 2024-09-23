const Listing = require('../models/listing');
const Review = require('../models/review.js');

module.exports.review=async (req, res) => {
    const listing = await Listing.findById(req.params.id); // Find listing by ID
    const newReview = new Review(req.body.review); // Create new review
    newReview.author=req.user._id;
    listing.reviews.push(newReview); // Push the new review into the listing's reviews array
    await newReview.save(); // Save the new review to the database
    await listing.save(); // Save the updated listing with the new review
    console.log("New review saved");
    res.redirect(`/listings/${listing._id}`); // Redirect back to the listing page
}

module.exports.deletereview=async(req,res)=>{
    let{id ,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});// listing chya review chya array madhun pull karun delet karnar ani update
    await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);
   }