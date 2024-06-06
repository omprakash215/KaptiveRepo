const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 4,
      minPoolSize: 2,
      maxIdleTimeMS: 5 * 60 * 1000,
    });
    console.log("===MongoDB Connected with Mongoose===");
  } catch (err) {
    console.error(
      "====Error while connecting to MongoDB with Mongoose====",
      err
    );
    throw err;
  }
};

module.exports = connectDB;