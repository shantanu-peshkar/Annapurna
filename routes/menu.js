const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const Listing = require('../models/listing');
const Menu = require('../models/menu');
const {isLoggedIn,isowner}=require("../middleware.js")
const menuController=require("../controllers/menu.js");

const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({storage })


//new menu
router.get("/menu",isLoggedIn,isowner,wrapAsync(menuController.creatmenu));


//menu delete
router.delete("/menus/:menuId",isLoggedIn,isowner, wrapAsync(menuController.deletemenu)
   
   )


//menu
router.post("/menus",isLoggedIn,isowner, upload.single('menu[image]'), wrapAsync(menuController.postmenu));  

module.exports=router;