const mongoose = require("mongoose")
const mongoURL = process.env.MONGODB
const initializeDatabase = async()=>{
   await mongoose.connect(mongoURL).then(()=>{
        console.log("Connected to DB successfully")
   }).catch((err)=>{
        console.log("Error connect to DB", err);
   })
}
module.exports = { initializeDatabase };