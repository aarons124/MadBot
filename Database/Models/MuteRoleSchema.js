const mongoose = require("mongoose");

const MuteRoleSchema = new mongoose.Schema({
  GuildID: { type: String },
  RoleID: { type: String }
});

module.exports = mongoose.model("mute-roles", MuteRoleSchema);