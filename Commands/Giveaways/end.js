const { Client, Message, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "end",
  aliases: ["ed"],
  cooldown: 4,
  category: "Giveaways",
  userPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Ends an active giveaway in the server",
  usage: "end <message_id>",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: (client, message, args) => {
    
    try {
      if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        return message.reply({ embeds: [
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} You need the [\`MANAGE_MESSAGES\`] permission to use this command.`)
        ]})
      }

      const msgId = args[0];

      if (!msgId) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} Provide an ID of the giveaway message you want to edit.`)
        ]})
      }

      if (isNaN(msgId)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} Provide a valid message ID.`)
          ]
        })
      }

      if (message.guild.members.cache.find(u => u.id === msgId)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} The provided ID belongs to a member of the server, try a valid message ID.`)
        ]})
      }

      if (message.guild.channels.cache.find(c => c.id === msgId)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} The provided ID belongs to a server channel, try a valid message ID.`)
        ]})
      }

      if (client.guilds.cache.get(msgId)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} The provided ID belongs to a server, try a valid message ID.`)
        ]})
      }

      const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === msgId);

      if (!giveaway) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} I couldn't find a giveaway on the server with this ID.`)
        ]})
      }

      client.giveawaysManager.end(msgId).then(() => {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#57F287")
          .setDescription(`${client.emotes.success} The giveaway has been ended!`)
        ]})
      }).catch(() => {
        return message.reply({ content: `${client.emotes.error} There was an error ending this giveaway, please try again.` })
      })
    } catch (e) {
      console.log(`[GDELETE_COMMAND]: ${e}`);
    }
  }
}