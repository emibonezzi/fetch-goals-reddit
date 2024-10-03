const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: String,
  url: String,
  screenshot: String,
  mediaIdTwitter: String,
});

module.exports = mongoose.model("Goal", goalSchema);
