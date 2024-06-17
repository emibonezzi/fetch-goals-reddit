const axios = require("axios");
require("dotenv").config();

module.exports = async () => {
  try {
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      null,
      {
        params: {
          grant_type: "client_credentials",
        },
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET,
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error(err.message);
  }
};
