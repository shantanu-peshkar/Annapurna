const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const {listingSchema ,reviewSchema,menuSchema,infoSchema}=require("../schema.js");
const ErrorExpress=require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const {isLoggedIn,isowner}=require("../middleware.js")
const listingController=require("../controllers/listing.js");
const { index } = require("../controllers/listing.js");

const multer  = require('multer');
const {storage}=require("../cloudconfig.js")
const upload = multer({storage })


const validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ErrorExpress(400, error.details[0].message); // Use error directly
    } else {
        next();
    }
}







router.get("/" ,wrapAsync(listingController.index) );



//new route
router.get("/new",isLoggedIn, listingController.newlisting)




//show route
router.get("/:id",isLoggedIn,wrapAsync(listingController.show));
  

// creat route
router.post("/",isLoggedIn, upload.single('listing[image]'),wrapAsync(listingController.creat));

//edit rout
router.get("/:id/edit",isLoggedIn,isowner,wrapAsync(listingController.edit));


//update
router.put("/:id",isLoggedIn,isowner,upload.single('listing[image]'),wrapAsync(listingController.update));

//delete
router.delete("/:id",isLoggedIn,isowner,wrapAsync(listingController.delete));
 module.exports= router;