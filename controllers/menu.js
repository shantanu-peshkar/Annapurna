const Listing = require('../models/listing');
const Menu = require('../models/menu');

module.exports .creatmenu=async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/menu.ejs",{listing});
}

module.exports.deletemenu=async(req,res)=>{
    let{id ,menuId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{menus: menuId}});// listing chya review chya array madhun pull karun delet karnar ani update
    await Menu.findByIdAndDelete(menuId);
   res.redirect(`/listings/${id}`);
   }

module.exports.postmenu=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    
    const listing = await Listing.findById(req.params.id); // Find the listing by ID
    const newMenu = new Menu(req.body.menu); // Create new menu from form data
    newMenu.image={url,filename};
    listing.menus.push(newMenu); // Push the new menu into the listing's menus array
   
    await newMenu.save(); // Save the new menu to the database
    await listing.save(); // Save the updated listing with the new menu
    console.log("New menu saved");
    res.redirect(`/listings/${listing._id}`); // Redirect back to the listing page
}