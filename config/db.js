const mongoose = require("mongoose");

const connectdb = async () => {
  try {
   
    await mongoose.connect(
      "mongodb+srv://Amantask:Aman814128@cluster0.prllcn8.mongodb.net/?retryWrites=true&w=majority",
    );
    console.log("mongodb connected ");
  } catch (error) {
    console.log("mongodb not connected ", error.message);

    process.exit(1);
  }
};

module.exports = connectdb;
