const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_TOKEN_SECRET,
});

const rwClient = client.readWrite;

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

module.exports = async (title, mediaId) => {
  try {
    // Post the tweet with the uploaded image
    await rwClient.v2.tweet({
      text: `${
        textOptions[Math.floor(Math.random() * textOptions.length)]
      }\n${title}\n\n${footer[Math.floor(Math.random() * footer.length)]}`,
      media: {
        media_ids: [mediaId],
      },
    });
  } catch (err) {
    console.log("Unknown error in uploading to Twitter...", err.message);
  }
};
