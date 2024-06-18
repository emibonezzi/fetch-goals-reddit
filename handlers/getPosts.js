const axios = require("axios");

module.exports = async (accessToken) => {
  try {
    // search for post with defined flairs
    const {
      data: { data },
    } = await axios.get("https://oauth.reddit.com/r/soccer/new", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 25,
      },
    });
    return data.children;
  } catch (err) {
    console.log("Error in retrieving reddit posts...", err.message);
  }
};
