const mongoose = require("mongoose");
async function ConnectDb() {
  try {
    await mongoose.connect("mongodb+srv://asharma7588:Ayush1234@cluster0.8ysl0ky.mongodb.net/SihDatabase")
    // await mongoose.connect(process.env.DatabaseConnect);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
}
module.exports = ConnectDb;
