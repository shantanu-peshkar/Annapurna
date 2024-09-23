const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Annapurna');
  
}

main()
.then(()=>{
    console.log("connected to data base");
}).catch((err)=>{
    console.log(err);
});


const initDB= async()=>{
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj , owner:"66ef01844c18598467c2657d"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();