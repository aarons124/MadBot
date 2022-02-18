const mongoose = require("mongoose");

const PrefixSchema = new mongoose.Schema({
  GuildID: { type: String },
  GuildName: { type: String },
  Prefix: { type: String },
  LastUpdate: { type: Date }
});

module.exports = mongoose.model("custom-prefixes", PrefixSchema);