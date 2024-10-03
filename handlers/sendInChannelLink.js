const axios = require("axios");
const urlTelegram = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendAnimation`;

module.exports = async (title, url) => {
  try {
    await axios.post(urlTelegram, {
      chat_id: process.env.CHAT_ID,
      caption: `${title}\n\n⤷ [Full Video](${url})🔗`,
      animation:
        "https://video-resize-bucket.s3.amazonaws.com/BlueWhiteMinimalistBadgeFootballClubLogo-ezgif.com-optimize.gif",
      parse_mode: "Markdown",
      duration: 5,
    });
  } catch (err) {
    console.log("Error in sending in Telegram Channel");
  }
};
