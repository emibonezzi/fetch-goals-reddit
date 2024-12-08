const axios = require("axios");

module.exports = async function (url) {
  try {
    const res = await axios.post(
      "https://rudb8c5vp1.execute-api.us-east-1.amazonaws.com/dev/resize",
      {
        video_url: url,
      }
    );
    return {
      original_url: res.data.original_url,
      resizedVideoUrl: res.data.resizedVideoUrl,
    };
  } catch (err) {
    console.error("Error in resizing the video:");

    // Log error message
    console.error("Message:", err.message);

    // Log status code if it exists
    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Data:", err.response.data);
    } else {
      console.error("No response received from the server.");
    }

    throw err;
  }
};
