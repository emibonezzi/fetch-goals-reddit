const mongoose = require("mongoose");
const Goal = require("../models/goal");

module.exports = async (newVideos) => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:${process.env.MONGO_DB_PASS}@goals.qejb4s7.mongodb.net/?retryWrites=true&w=majority&appName=Goals`
    );
    for (const video of newVideos) {
      // create new goal
      const goal = new Goal(video);
      await goal.save();
    }
  } catch (err) {
    console.log("Error in dealing with db...", err.message);
    throw err;
  }
};
