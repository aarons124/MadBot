const prefixData = require("../Database/Models/PrefixSchema");

module.exports = {
  getPrefix: async function(message) {
    if (!message.guild) return;
    let customPrefix;

    const data = await prefixData.findOne({
      GuildID: message.guild.id
    });

    if (data) {
      customPrefix = data.Prefix;
    } else {
      customPrefix = "%"
    }

    return customPrefix;
  }
}