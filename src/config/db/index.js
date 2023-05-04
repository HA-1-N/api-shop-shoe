const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Mongoose connect successful !!");
  } catch (error) {
    console.log("Error");
  }
}

module.exports = { connect };
