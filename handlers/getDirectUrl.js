const axios = require("axios");
require("dotenv").config();

module.exports = async function (url) {
  try {
    const res = await axios.post(process.env.CLEAN_LINK_URL, {
      url: url,
    });
    return res.data.video_url;
  } catch (err) {
    console.log("Error in extracting video url...");
  }
};
