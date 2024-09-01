const axios = require("axios");
const urlTelegram = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendVideo`;

module.exports = async (title, url) => {
  try {
    await axios.post(urlTelegram, {
      chat_id: process.env.CHAT_ID,
      video: url,
      caption: title,
    });
  } catch (err) {
    console.log("Error in sending in Telegram Channel");
  }
};
