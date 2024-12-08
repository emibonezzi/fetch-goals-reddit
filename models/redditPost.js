const mongoose = require("mongoose");

const redditPost = new mongoose.Schema({
  title: String,
  url: String,
});

module.exports = mongoose.model("RedditPost", redditPost);
