const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Remove deprecated options - they're not needed in Mongoose 8+
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(`Connection string: ${process.env.MONGODB_URI ? 'Set (hidden)' : 'NOT SET'}`);
    process.exit(1);
  }
};

module.exports = connectDB;

