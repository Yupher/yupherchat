const mongoose = require("mongoose");

const connectDb = async () => {
  let url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chatapp";
  try {
    mongoose.set({ strictQuery: false });
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
    });
    console.log(`mongodb connected  ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`mongodb connection error`.red);
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
