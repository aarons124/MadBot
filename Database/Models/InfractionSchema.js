const mongoose = require("mongoose");

const BanSchema = new mongoose.Schema({
  GuildID: { type: String },
  UserID: { type: String },
  BanData: { type: Array },
  KickData: { type: Array },
  MuteData: { type: Array },
  WarnData: { type: Array }
});

module.exports = mongoose.model("infractions-schema", BanSchema);