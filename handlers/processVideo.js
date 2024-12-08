const getDirectUrl = require("./getDirectUrl");
const resizeVideo = require("./resizeVideo");

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

        console.log(videoUrlResized);

        // add to updates arr
        updates.push({
          league: titleObj.league,
          homeTeam: titleObj.homeTeam,
          awayTeam: titleObj.awayTeam,
          goalScorer: titleObj.goalScorer,
          videoUrl: videoUrlResized.resizedVideoUrl,
          title: titleObj.originalPostTitle,
        });
      } catch (err) {
        // if err in downloading and resizing

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
