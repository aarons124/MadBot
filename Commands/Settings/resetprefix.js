const { Client, Message, MessageEmbed, Permissions } = require("discord.js");
const prefixModel = require("../../Database/Models/PrefixSchema");

module.exports = {
  name: "resetprefix",
  aliases: ["rprefix"],
  cooldown: 5,
  category: "Administrador",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    try {

      if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#5865F2")
          .setDescription(`${client.emotes.error} You need the [\`ADMINISTRATOR\`] permission to use this command.`)
        ] }).then(sent => {
          setTimeout(() => {
            sent.delete();
          }, 5000)
        })
      }

      let currentData = await prefixModel.findOneAndDelete({
        GuildID: message.guild.id
      });

      if (!currentData) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#5865F2")
          .setDescription(`${client.emotes.error} There is not custom prefix set in this server.`)
        ]})
      }

      return message.reply({ embeds:[
        new MessageEmbed()
        .setColor("#5865F2")
        .setDescription(`${client.emotes.success} Custom prefix reset! Current prefix is now **%**`)
      ] })

    } catch (e) {
      console.log(`[RESET-PREFIX_COMMAND]: ${e}`);
    }
  }
}