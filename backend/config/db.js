const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose.set({ strictQuery: false });
    const conn = await mongoose.connect(
      "mongodb://127.0.0.1:27017/chatapp" /*process.env.MONGO_URI*/,
      {
        useNewUrlParser: true,
      },
    );
    console.log(`mongodb connected  ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`mongodb connection error`.red);
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
