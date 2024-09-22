const axios = require("axios");
const urlTelegram = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

module.exports = async (title, url) => {
  try {
    await axios.post(urlTelegram, {
      chat_id: process.env.CHAT_ID,
      text: `${title}\n\n${url}`,
    });
  } catch (err) {
    console.log("Error in sending in Telegram Channel");
  }
};
