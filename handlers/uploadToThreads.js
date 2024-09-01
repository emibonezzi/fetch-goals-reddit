const axios = require("axios");

const textOptions = [
  "⚽ GOOOOOOOOOAL!!!",
  "🔥 GOOOOAL!!!",
  "🎉 GOOOOOOOAL!!!",
  "💥 GOAL!!!",
  "⚡ GOOOOOAL!!!",
  "🏆 GOOOOOOOOAAAAL!!!",
  "🎯 GOOOOAL!!!",
  "🚀 GOOOOOOAAAAL!!!",
  "✨ GOL!!!",
  "🌟 GOOOOOOOOOAAAAAL!!!",
];

const footer = [
  "📲✨ Join our Telegram channel for the video: https://t.me/+BuDogIG1YEg3ZjM8",
  "🚀📲 Subscribe to our Telegram channel for the latest video: https://t.me/+BuDogIG1YEg3ZjM8",
  "🔥📲 Don't miss out! Join our Telegram channel to watch the video: https://t.me/+BuDogIG1YEg3ZjM8",
  "🎥📲 Get the video on our Telegram channel: https://t.me/+BuDogIG1YEg3ZjM8",
  "👀📲 Watch the video by joining our Telegram channel: https://t.me/+BuDogIG1YEg3ZjM8",
];

module.exports = async (title, url) => {
  try {
    // create media container
    const mediaContainer = await axios.post(
      "https://graph.threads.net/v1.0/8063816050370756/threads",
      {
        media_type: "IMAGE",
        image_url: url,
        redirect_uri: "https://oauth.pstmn.io/v1/callback",
        text: `${
          textOptions[Math.floor(Math.random() * textOptions.length)]
        }\n${title}\n\n${footer[Math.floor(Math.random() * footer.length)]}`,
        access_token: process.env.THREADS_ACCESS_TOKEN, // change token in 60 days from august 25 2024
      }
    );
    const mediaID = mediaContainer.data.id;
    console.log("***** MEDIA ID *****", mediaID);

    // Step 2: Check the status of the media container
    let status = "IN_PROGRESS";
    while (status !== "FINISHED") {
      console.log("Checking status for mediaID:", mediaID);
      const statusCheck = await axios.get(
        `https://graph.threads.net/v1.0/${mediaID}?fields=status&access_token=${process.env.THREADS_ACCESS_TOKEN}`
      );
      status = statusCheck.data.status;
      console.log("Current status:", status);

      if (status !== "FINISHED") {
        // Wait for a few seconds before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay
      }
    }

    // post
    const postId = await axios.post(
      "https://graph.threads.net/v1.0/8063816050370756/threads_publish",
      {
        creation_id: mediaID,
        redirect_uri: "https://oauth.pstmn.io/v1/callback",
        access_token: process.env.THREADS_ACCESS_TOKEN,
      }
    );
    console.log(postId);
  } catch (err) {
    if (err.response) {
      console.log("Error in uploading to Threads...");
      console.log("Status:", err.response.status);
      console.log("Headers:", err.response.headers);
      console.log("Data:", err.response.data);
    } else {
      console.log("Unknown error in uploading to Threads...", err.message);
    }
  }
};
