const axios = require("axios");

module.exports = async (title, url) => {
  try {
    // create media container
    console.log(
      "video_url",
      url,
      "text:",
      title,
      "access_token",
      process.env.THREADS_ACCESS_TOKEN
    );
    const mediaContainer = await axios.post(
      "https://graph.threads.net/v1.0/8063816050370756/threads",
      {
        media_type: "VIDEO",
        video_url: url,
        text: title,
        access_token: process.env.THREADS_ACCESS_TOKEN, // change token in 60 days from august 25 2024
      }
    );
    const mediaID = mediaContainer.data.id;
    console.log("***** MEDIA ID *****", mediaID);
    // post
    const postId = await axios.post(
      "https://graph.threads.net/v1.0/8063816050370756/threads_publish",
      {
        creation_id: mediaID,
        access_token: process.env.THREADS_ACCESS_TOKEN,
      }
    );
    console.log(postId);
  } catch (err) {
    console.log("Error in uploading to Threads...moving on", err.message);
  }
};
