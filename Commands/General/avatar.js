const { getMember } = require("../../Functions/GetMember");
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av", "pfp", "icon"],
  cooldown: 4,
  category: "General",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Shows your avatar or a member\'s avatar",
  usage: "avatar [mention or ID]",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    try {
      const embed = new MessageEmbed();
      const member = await getMember(message, args.join(""));
      const avaurl = member.user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 });
      const pngURL = member.user.displayAvatarURL({ dynamic: true, format: "png", size: 4096 });
      const jpgURL = member.user.displayAvatarURL({ dynamic: true, format: "jpg", size: 4096 });
      const webpURL = member.user.displayAvatarURL({ dynamic: true, format: "webp", size: 4096 });
      const gifURL = member.user.displayAvatarURL({ dynamic: true, format: "gif", size: 4096 });

      embed.setImage(avaurl)
      .setColor("BLUE")
      .setTitle(`Avatar for ${member.user.username}`)
      .setDescription(`[PNG](${pngURL}}) | [JPG](${jpgURL}}) | [WEBP](${webpURL}}) | [GIF](${gifURL}})`)
      .setFooter({ text: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true, format: "png" })}`})
      .setTimestamp(new Date())

      message.reply({ embeds: [embed] })
    } catch (error) {
      console.error(error);
    }
  }
}