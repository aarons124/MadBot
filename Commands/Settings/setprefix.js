const { Client, Message, MessageEmbed, Permissions } = require("discord.js");
const prefixModel = require("../../Database/Models/PrefixSchema");

module.exports = {
  name: "setprefix",
  aliases: ["prefix"],
  cooldown: 5,
  category: "Administrador",
  userPermissions: ["ADMINISTRATOR"],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Sets a custom prefix for the server",
  usage: "setprefix <new prefix>",

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

      const new_prefix = args[0];
      if (!new_prefix) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} Please provide a new prefix.`)
        ] })
      }

      if (new_prefix.length > 2) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} The prefix cannot contain more than 2 characters.`)
        ] })
      }

      let currentData = await prefixModel.findOne({
        GuildID: message.guild.id
      });

      let newData = new prefixModel({
        GuildID: message.guild.id,
        GuildName: message.guild.name,
        Prefix: new_prefix,
        Date: new Date().toLocaleString("en-US", { timeZone: "America/Merida" })
      });

      currentData ? await prefixModel.updateOne({
        Prefix: new_prefix,
        Date: new Date().toLocaleString("en-US", { timeZone: "America/Merida" })
      }) : await newData.save();

      return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#57F287")
          .setDescription(`${client.emotes.success} Server prefix set to **${new_prefix}**`)
        ] })

    } catch (e) {
      console.log(`[PREFIX_COMMAND]: ${e}`);
    }
  }
}