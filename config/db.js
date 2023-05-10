const mongoose=require('mongoose');
let connect=async()=>{
    await mongoose.connect("mongodb+srv://rw5kuldeephs:admin@cluster0.idnftpe.mongodb.net/?retryWrites=true&w=majority")
    console.log("connected to MongoDB")
}

module.exports=connect;