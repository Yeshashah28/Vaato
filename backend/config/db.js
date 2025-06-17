const mongoose = require("mongoose");

const db = async () => {
  try {
    const dbconnect = await mongoose.connect(process.env.MONGOOSE_URI, {
    });
    console.log("database connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = db;
