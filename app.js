if(process.env.Node_env != "production"){
    require('dotenv').config()
}




const express= require("express");
const app= express();
const mongoose=require("mongoose");
const Listing = require('./models/listing'); // Adjust the path as necessary
const path= require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapasync.js");
const ErrorExpress=require("./utils/ExpressError.js");
const Menu = require('./models/menu');
const MessDetail = require('./models/detail'); // Adjust the path as necessary
const listings=require("./routes/listing.js");
const review=require("./routes/review.js");
const menu=require("./routes/menu.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")
const userRouter=require("./routes/user.js")
const {isLoggedIn,isowner}=require("./middleware.js")
const tokenRoutes = require('./routes/token');

const dbUrl=process.env.ATLASDB_URL;


async function main() {
    await mongoose.connect( dbUrl);
  
}

main()
.then(()=>{
    console.log("connected to data base");
}).catch((err)=>{
    console.log(err);
});






app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));// use for parsing
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})


const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 *24 * 60 * 60 *1000,
        maxAge: 7* 24 * 60 * 60 * 1000,
    }
};







//authentication 
app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



//filter
app.get("/listings/filter",isLoggedIn, wrapAsync(async (req, res) => {
    const { star } = req.query;
    const rating = parseInt(star, 10);

    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.redirect("/listings"); // Redirect if invalid star rating
    }

    // Aggregate listings based on average review rating
    const listings = await Listing.aggregate([
        {
            $lookup: {
                from: "reviews", // The reviews collection
                localField: "reviews",
                foreignField: "_id",
                as: "reviewDetails"
            }
        },
        {
            $addFields: {
                avgRating: { $avg: "$reviewDetails.rating" } // Calculate average star rating
            }
        },
        {
            $match: {
                avgRating: { $gte: rating } // Filter listings with avgRating >= selected star rating
            }
        }
    ]);

    res.render("listings/index.ejs", { allListings: listings });
}));



app.get('/', (req, res) => {
    res.redirect('/listings'); // Redirect to the listings page or render a homepage
});





//map
app.get("/listings/map",isLoggedIn,(req,res)=>{
    res.render("listings/map.ejs");
})



//router
app.use("/listings",listings);
app.use("/listings/:id/reviews",review);
app.use("/listings/:id",menu);
app.use("/",userRouter);
app.use('/listings', tokenRoutes);


// __________________________________________________messdetail_______________________________________________


// Render the form to add mess details
app.get("/listings/:id/messdetails/new",isLoggedIn,isowner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    res.render('listings/messdetail.ejs', { listing });
}));

// Handle form submission to create mess details
app.post("/listings/:id/messdetails",isLoggedIn,isowner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { ownerName, contactDetails, messDescription, termsAndConditions } = req.body.messDetail;

    // Create a new MessDetail document
    const newMessDetail = new MessDetail({
        ownerName,
        contactDetails,
        messDescription,
        termsAndConditions
    });

    await newMessDetail.save();

    // Update the listing to associate it with the new MessDetail
    const listing = await Listing.findById(id);
    listing.messDetail = newMessDetail._id;
    await listing.save();
    
    res.redirect(`/listings/${id}`);
}));




app.get('/search', async (req, res) => {
    const query = req.query.q; // Get the search query from the URL
    if (!query || query.trim() === '') {
        return res.redirect('/listings'); // Redirect if no query or empty query
    }
    try {
        // Find listings by title (case-insensitive search)
        const listing = await Listing.findOne({ title: { $regex: query, $options: 'i' } })
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author', // Populate the author field in reviews
                    select: 'username' // Select the username field from the User model
                }
            })
            .populate('owner'); // Populate the owner field if necessary

        if (!listing) {
            return res.status(404).send('Listing not found'); // Handle case where no listing is found
        }
        res.render('listings/show', { listing }); // Render show.ejs with the found listing
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});




app.use((err ,req,res,next)=>{
    let {statuscode=500, message="something went wrong"}=err;
   res.status(statuscode).render("error.ejs" ,{message});
})


app.listen(8040 , ()=>{
    console.log("server is listening to port 8040")
});





