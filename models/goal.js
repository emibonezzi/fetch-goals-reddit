const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  league: String,
  homeTeam: String,
  awayTeam: String,
  goalScorer: String,
  videoUrl: String,
  title: String,
  sentToSubscribers: { type: Boolean, default: false },
});

module.exports = mongoose.model("Goal", goalSchema);
