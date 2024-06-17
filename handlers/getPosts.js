const axios = require("axios");

module.exports = async (accessToken) => {
  try {
    // search for post with defined flairs
    const {
      data: { data },
    } = await axios.get("https://oauth.reddit.com/r/soccer/search", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: 'flair:"Media"',
        restrict_sr: "true",
        limit: 25,
        t: "hour",
      },
    });
    return data.children;
  } catch (err) {
    console.log("Error in retrieving reddit posts...", err.message);
  }
};
