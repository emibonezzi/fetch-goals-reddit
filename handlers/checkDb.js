const mongoose = require("mongoose");
const getDirectUrl = require("./getDirectUrl");
const resizeVideo = require("./resizeVideo");
const uploadToThreads = require("./uploadToThreads");
const sendInChannel = require("./sendInChannel");
const uploadToTwitter = require("./uploadToTwitter");
const sendInChannelLink = require("./sendInChannelLink");
const uploadToTwitterLink = require("./uploadToTwitterLink");

const goalSchema = new mongoose.Schema({
  title: String,
  url: String,
  screenshot: String,
  mediaIdTwitter: String,
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
        let directUrl;
        // check if reddit video
        if (!titleObj.redditVideo) {
          // extract video url
          directUrl = await getDirectUrl(titleObj.url);
        } else {
          directUrl = titleObj.redditVideo;
        }

        if (titleObj.url.startsWith("https://caulse.com")) {
          // upload to telegram
          await sendInChannelLink(titleObj.title, directUrl);
          const news = new Goal({
            title: titleObj.title,
            url: directUrl,
            screenshot: null,
            mediaIdTwitter: null,
          });
          // Upload text to Twitter
          await uploadToTwitterLink(titleObj.title);
          // save in db
          await news.save();
          // add to updates arr
          updates.push({
            title: titleObj.title,
            url: directUrl,
          });
          continue;
        }

        // resize video
        console.log("Extracted direct video: ", directUrl);
        const videoUrlResized = await resizeVideo(directUrl);
        const news = new Goal({
          title: titleObj.title,
          url: videoUrlResized.resizedVideoUrl,
          screenshot: videoUrlResized.screenshotUrl,
          mediaIdTwitter: videoUrlResized.mediaIdTwitter,
        });
        // upload to threads
        await uploadToThreads(titleObj.title, videoUrlResized.screenshotUrl);
        // upload to telegram
        await sendInChannel(titleObj.title, videoUrlResized.resizedVideoUrl);
        // upload to twitter
        await uploadToTwitter(titleObj.title, videoUrlResized.mediaIdTwitter);
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
