const mongoose=require('mongoose');
let connect=async()=>{
    await mongoose.connect("mongodb://127.0.0.1:27017")
    console.log("connected to MongoDB")
}

module.exports=connect;