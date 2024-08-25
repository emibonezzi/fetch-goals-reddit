const axios = require("axios");

module.exports = async (title, url) => {
  try {
    // create media container
    const mediaContainer = await axios.post(
      "https://graph.threads.net/v1.0/me/threads",
      {
        media_type: "VIDEO",
        video_url: url,
        text: title,
        access_token: process.env.THREADS_ACCESS_TOKEN, // change token in 60 days from august 25 2024
      }
    );
    // post
    await axios.post("https://graph.threads.net/v1.0/me/threads_publish", {
      creation_id: mediaContainer.data.id,
      access_token: process.env.THREADS_ACCESS_TOKEN,
    });
  } catch (err) {
    console.log("Error in uploading to Threads...moving on");
  }
};
