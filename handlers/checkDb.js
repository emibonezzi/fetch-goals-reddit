const getDirectUrl = require("./getDirectUrl");
const resizeVideo = require("./resizeVideo");
const uploadToThreads = require("./uploadToThreads");
const sendInChannel = require("./sendInChannel");
const uploadToTwitter = require("./uploadToTwitter");
const sendInChannelLink = require("./sendInChannelLink");
const uploadToTwitterLink = require("./uploadToTwitterLink");

module.exports = async (titles) => {
  const updates = [];
  try {
    for (const titleObj of titles) {
      // try downloading and resizing video
      try {
        let directUrl;
        // check if reddit video
        if (!titleObj.isRedditVideo) {
          // extract video url
          directUrl = await getDirectUrl(titleObj.externalVideoUrl);
        } else {
          directUrl = titleObj.fallbackUrlRedditVideo;
        }

        // resize video
        console.log("Extracted direct video: ", directUrl);
        const videoUrlResized = await resizeVideo(directUrl);

        // upload to threads
        await uploadToThreads(
          titleObj.commentary,
          videoUrlResized.screenshotUrl
        );
        // upload to telegram
        await sendInChannel(
          titleObj.commentary,
          videoUrlResized.resizedVideoUrl
        );
        // upload to twitter
        await uploadToTwitter(
          titleObj.commentary,
          videoUrlResized.mediaIdTwitter
        );
        // add to updates arr
        updates.push({
          title: titleObj.originalPostTitle,
          url: directUrl,
        });
      } catch (err) {
        // if err in downloading and resizing
        // upload to telegram
        await sendInChannelLink(titleObj.commentary, titleObj.externalVideoUrl);
        // Upload text to Twitter
        await uploadToTwitterLink(titleObj.originalPostTitle);
        // add to updates arr
        updates.push({
          title: titleObj.originalPostTitle,
          url: titleObj.externalVideoUrl,
        });
        continue;
      }
    }

    return updates;
  } catch (err) {
    console.log("Error in dealing with db...", err.message);
    throw err;
  }
};
