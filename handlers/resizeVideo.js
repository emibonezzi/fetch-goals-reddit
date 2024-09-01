const axios = require("axios");

module.exports = async function (url) {
  try {
    const res = await axios.post(
      "https://rudb8c5vp1.execute-api.us-east-1.amazonaws.com/dev/resize",
      {
        video_url: url,
      }
    );
    return {
      resizedVideoUrl: res.data.resizedVideoUrl,
      screenshotUrl: res.data.screenshotUrl,
      mediaIdTwitter: res.data.mediaIdTwitter,
    };
  } catch (err) {
    console.log("Error in resizing the video...", err.message);
    throw err;
  }
};
