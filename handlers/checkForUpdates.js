const mongoose = require("mongoose");

const Goal = require("../models/goalModel");

module.exports = async (titles) => {
  const updates = [];
  try {
    await mongoose.connect(
      `mongodb+srv://admin:${process.env.MONGO_DB_PASS}@goals.qejb4s7.mongodb.net/?retryWrites=true&w=majority&appName=Goals`
    );

    for (const titleObj of titles.filter(
      (post) => post.data.link_flair_text === "Media"
    )) {
      const existingNews = await Goal.findOne({
        title: titleObj.data.title.trim(),
      });

      // if news is not found
      if (!existingNews) {
        const news = new Goal({
          title: titleObj.data.title.trim(),
          url: titleObj.data.url,
          screenshot: null,
          mediaIdTwitter: null,
        });
        // save in db
        await news.save();
        // add to updates arr
        updates.push(titleObj);
      }
    }

    mongoose.connection.close();
    return updates;
  } catch (err) {
    console.log("Error in dealing with db...", err.message);
    throw err;
  }
};
