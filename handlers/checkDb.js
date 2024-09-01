const mongoose = require("mongoose");
const getDirectUrl = require("./getDirectUrl");
const resizeVideo = require("./resizeVideo");
const uploadToThreads = require("./uploadToThreads");

const goalSchema = new mongoose.Schema({
  title: String,
  url: String,
  screenshot: String,
});

const Goal = mongoose.model("Goal", goalSchema);

module.exports = async (titles) => {
  const updates = [];
  try {
    await mongoose.connect(
      `mongodb+srv://admin:${process.env.MONGO_DB_PASS}@goals.qejb4s7.mongodb.net/?retryWrites=true&w=majority&appName=Goals`
    );

    for (const titleObj of titles) {
      const existingNews = await Goal.findOne({ title: titleObj.title });

      // if news is not found
      if (!existingNews) {
        // extract video url
        const directUrl = await getDirectUrl(titleObj.url);
        // resize video
        console.log("Extracted direct video: ", directUrl);
        const videoUrlResized = await resizeVideo(directUrl);
        const news = new Goal({
          title: titleObj.title,
          url: videoUrlResized.resizedVideoUrl,
          screenshot: videoUrlResized.screenshotUrl,
        });
        // upload to threads
        await uploadToThreads(titleObj.title, videoUrlResized.screenshotUrl);
        // save in db
        await news.save();
        // add to updates arr
        updates.push({
          title: titleObj.title,
          url: directUrl,
        });
      }
    }

    mongoose.connection.close();
    return updates;
  } catch (err) {
    console.log("Error in dealing with db...", err.message);
    throw err;
  }
};
