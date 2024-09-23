const Listing=require("./models/listing")
const Review = require('./models/review.js');
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create business account")
        return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isowner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id)
    if(!req.user || !listing.owner.equals(req.user._id)){
        req.flash("error","you don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isreviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review=await Review.findById(reviewId)
    if(!req.user || !review.author.equals(req.user._id)){
        req.flash("error","you don't have permission to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}